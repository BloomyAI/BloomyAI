import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const API_BASE = 'https://bloomy.ai'; // swap to your Vercel URL

type Role = 'user' | 'assistant';
interface Message {
  id: string;
  role: Role;
  content: string;
}

type ModelKey = 'flash' | 'core' | 'code';

const MODELS: {key: ModelKey; label: string; color: string}[] = [
  {key: 'flash', label: 'Flash', color: '#8B5CF6'},
  {key: 'core', label: 'Core', color: '#3B82F6'},
  {key: 'code', label: 'Coder', color: '#10B981'},
];

const THINKING_PHRASES: Record<ModelKey, string[]> = {
  flash: ['Thinking...', 'Almost there...', 'Generating response...'],
  core: ['Processing...', 'Analyzing...', 'Generating response...'],
  code: ['Reading the code...', 'Writing solution...', 'Compiling thoughts...'],
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelKey>('flash');
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const listRef = useRef<FlatList>(null);
  const thinkingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startThinking = useCallback(() => {
    setThinkingPhase(0);
    const phrases = THINKING_PHRASES[selectedModel];
    thinkingTimer.current = setInterval(() => {
      setThinkingPhase(p => (p + 1) % phrases.length);
    }, 1800);
  }, [selectedModel]);

  const stopThinking = useCallback(() => {
    if (thinkingTimer.current) {
      clearInterval(thinkingTimer.current);
      thinkingTimer.current = null;
    }
    setThinkingPhase(0);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    startThinking();

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          message: userMsg.content,
          model: selectedModel,
          conversationId: 'mobile-session',
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      setMessages(prev => [
        ...prev,
        {id: assistantId, role: 'assistant', content: ''},
      ]);

      if (reader) {
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          const text = decoder.decode(value, {stream: true});
          for (const line of text.split('\n')) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk') {
                  assistantContent += data.content;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? {...m, content: assistantContent}
                        : m,
                    ),
                  );
                }
              } catch {}
            }
          }
        }
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Error connecting to Bloomy AI. Please try again.',
        },
      ]);
    } finally {
      stopThinking();
      setIsTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({animated: true}), 100);
    }
  }, [input, isTyping, selectedModel, startThinking, stopThinking]);

  const renderMessage = ({item}: {item: Message}) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  const activeModel = MODELS.find(m => m.key === selectedModel)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#13151C" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Bloomy AI</Text>
        <View style={styles.modelRow}>
          {MODELS.map(m => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setSelectedModel(m.key)}
              style={[
                styles.modelPill,
                selectedModel === m.key && {
                  backgroundColor: m.color + '33',
                  borderColor: m.color,
                },
              ]}>
              <Text
                style={[
                  styles.modelLabel,
                  selectedModel === m.key && {color: m.color},
                ]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({animated: true})}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>What's on your mind?</Text>
            <Text style={styles.emptySubtitle}>
              {activeModel.label} is ready to help
            </Text>
          </View>
        }
        ListFooterComponent={
          isTyping ? (
            <View style={styles.thinkingRow}>
              <View style={[styles.thinkingOrb, {backgroundColor: activeModel.color}]} />
              <Text style={styles.thinkingText}>
                {THINKING_PHRASES[selectedModel][thinkingPhase]}
              </Text>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message Bloomy AI..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={4000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isTyping}
            style={[
              styles.sendBtn,
              {backgroundColor: activeModel.color},
              (!input.trim() || isTyping) && styles.sendBtnDisabled,
            ]}>
            {isTyping ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendIcon}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#13151C'},
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2333',
    backgroundColor: '#13151C',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  modelRow: {flexDirection: 'row', gap: 8},
  modelPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2D3E',
    backgroundColor: 'transparent',
  },
  modelLabel: {color: '#9CA3AF', fontSize: 13, fontWeight: '600'},
  messageList: {padding: 16, flexGrow: 1},
  messageBubble: {
    maxWidth: '82%',
    marginBottom: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1F2333',
    borderWidth: 1,
    borderColor: '#2A2D3E',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A2D3E',
  },
  messageText: {color: '#E5E7EB', fontSize: 15, lineHeight: 22},
  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 120},
  emptyTitle: {color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 6},
  emptySubtitle: {color: '#6B7280', fontSize: 15},
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  thinkingOrb: {width: 10, height: 10, borderRadius: 5},
  thinkingText: {color: '#9CA3AF', fontSize: 14},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    backgroundColor: '#13151C',
    borderTopWidth: 1,
    borderTopColor: '#1F2333',
  },
  input: {
    flex: 1,
    backgroundColor: '#1F2333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#2A2D3E',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {opacity: 0.4},
  sendIcon: {color: '#fff', fontSize: 18, fontWeight: '700'},
});
