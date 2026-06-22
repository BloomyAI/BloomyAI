import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Basic command validation to prevent dangerous commands
    const dangerousCommands = ['rm -rf', 'del /f', 'format', 'shutdown', 'reboot'];
    const isDangerous = dangerousCommands.some(cmd => command.toLowerCase().includes(cmd.toLowerCase()));
    
    if (isDangerous) {
      return NextResponse.json({ error: 'Dangerous command not allowed' }, { status: 403 });
    }

    // Execute the command
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    const output = stdout || stderr || 'Command executed successfully';

    return NextResponse.json({ 
      success: true, 
      output: output,
      error: stderr || null 
    });

  } catch (error: any) {
    console.error('Command execution error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Command execution failed' 
    }, { status: 500 });
  }
}
