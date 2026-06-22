"""Multi-provider support for Bloomy AI with OpenAI, Anthropic, Google, DeepSeek, Mistral, Grok, Ollama, and OpenRouter."""

from __future__ import annotations

import os
from enum import Enum
from typing import Any, Literal


class BloomyProvider(str, Enum):
    """Supported AI providers for Bloomy AI."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    DEEPSEEK = "deepseek"
    MISTRAL = "mistral"
    GROK = "grok"
    OLLAMA = "ollama"
    OPENROUTER = "openrouter"


class ProviderConfig:
    """Configuration for AI providers."""
    
    # Base URLs for each provider
    BASE_URLS = {
        BloomyProvider.OPENAI: "https://api.openai.com/v1",
        BloomyProvider.ANTHROPIC: "https://api.anthropic.com/v1",
        BloomyProvider.GOOGLE: "https://generativelanguage.googleapis.com/v1",
        BloomyProvider.DEEPSEEK: "https://api.deepseek.com/v1",
        BloomyProvider.MISTRAL: "https://api.mistral.ai/v1",
        BloomyProvider.GROK: "https://api.x.ai/v1",
        BloomyProvider.OLLAMA: "http://localhost:11434/v1",
        BloomyProvider.OPENROUTER: "https://openrouter.ai/api/v1",
    }
    
    # Environment variable names for API keys
    API_KEY_ENV_VARS = {
        BloomyProvider.OPENAI: "OPENAI_API_KEY",
        BloomyProvider.ANTHROPIC: "ANTHROPIC_API_KEY",
        BloomyProvider.GOOGLE: "GOOGLE_API_KEY",
        BloomyProvider.DEEPSEEK: "DEEPSEEK_API_KEY",
        BloomyProvider.MISTRAL: "MISTRAL_API_KEY",
        BloomyProvider.GROK: "GROK_API_KEY",
        BloomyProvider.OLLAMA: None,  # Ollama doesn't require an API key for local use
        BloomyProvider.OPENROUTER: "OPENROUTER_API_KEY",
    }
    
    # Default models for each provider
    DEFAULT_MODELS = {
        BloomyProvider.OPENAI: "gpt-4o",
        BloomyProvider.ANTHROPIC: "claude-3.5-sonnet",
        BloomyProvider.GOOGLE: "gemini-2.0-flash",
        BloomyProvider.DEEPSEEK: "deepseek-v3",
        BloomyProvider.MISTRAL: "mistral-large",
        BloomyProvider.GROK: "grok-2",
        BloomyProvider.OLLAMA: "llama3.1",
        BloomyProvider.OPENROUTER: "anthropic/claude-3.5-sonnet",
    }
    
    @classmethod
    def get_base_url(cls, provider: BloomyProvider | str, custom_url: str | None = None) -> str:
        """Get the base URL for a provider.
        
        Args:
            provider: The provider enum or string
            custom_url: Optional custom base URL override
            
        Returns:
            The base URL for the provider
        """
        if custom_url:
            return custom_url
        
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        return cls.BASE_URLS[provider]
    
    @classmethod
    def get_api_key(cls, provider: BloomyProvider | str, custom_key: str | None = None) -> str | None:
        """Get the API key for a provider.
        
        Args:
            provider: The provider enum or string
            custom_key: Optional custom API key override
            
        Returns:
            The API key or None if not set
        """
        if custom_key:
            return custom_key
        
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        env_var = cls.API_KEY_ENV_VARS[provider]
        if env_var:
            return os.getenv(env_var)
        
        return None
    
    @classmethod
    def get_default_model(cls, provider: BloomyProvider | str) -> str:
        """Get the default model for a provider.
        
        Args:
            provider: The provider enum or string
            
        Returns:
            The default model identifier
        """
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        return cls.DEFAULT_MODELS[provider]
    
    @classmethod
    def is_provider_available(cls, provider: BloomyProvider | str) -> bool:
        """Check if a provider is available (has API key set).
        
        Args:
            provider: The provider enum or string
            
        Returns:
            True if the provider has an API key set (or doesn't require one)
        """
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        api_key = cls.get_api_key(provider)
        if api_key:
            return True
        
        # Ollama doesn't require an API key
        if provider == BloomyProvider.OLLAMA:
            return True
        
        return False
    
    @classmethod
    def get_available_providers(cls) -> list[BloomyProvider]:
        """Get a list of all available providers (those with API keys set).
        
        Returns:
            List of available provider enums
        """
        return [
            provider for provider in BloomyProvider
            if cls.is_provider_available(provider)
        ]


class ProviderClient:
    """Base class for provider-specific clients."""
    
    def __init__(
        self,
        provider: BloomyProvider | str,
        api_key: str | None = None,
        base_url: str | None = None,
    ):
        """Initialize a provider client.
        
        Args:
            provider: The provider to use
            api_key: Optional API key override
            base_url: Optional base URL override
        """
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        self.provider = provider
        self.api_key = api_key or ProviderConfig.get_api_key(provider)
        self.base_url = base_url or ProviderConfig.get_base_url(provider)
        self.default_model = ProviderConfig.get_default_model(provider)
    
    def get_headers(self) -> dict[str, str]:
        """Get the headers for API requests.
        
        Returns:
            Dictionary of headers
        """
        headers = {"Content-Type": "application/json"}
        
        if self.api_key:
            if self.provider == BloomyProvider.OPENAI:
                headers["Authorization"] = f"Bearer {self.api_key}"
            elif self.provider == BloomyProvider.ANTHROPIC:
                headers["x-api-key"] = self.api_key
                headers["anthropic-version"] = "2023-06-01"
            elif self.provider == BloomyProvider.OPENROUTER:
                headers["Authorization"] = f"Bearer {self.api_key}"
                headers["HTTP-Referer"] = "https://bloomy.ai"
                headers["X-Title"] = "Bloomy AI"
            else:
                headers["Authorization"] = f"Bearer {self.api_key}"
        
        return headers
    
    def get_model(self, model: str | None = None) -> str:
        """Get the model to use.
        
        Args:
            model: Optional model override
            
        Returns:
            The model identifier
        """
        return model or self.default_model


class MultiProviderRouter:
    """Router for managing multiple providers and smart routing."""
    
    def __init__(self):
        """Initialize the multi-provider router."""
        self.clients: dict[BloomyProvider, ProviderClient] = {}
        self._initialize_available_providers()
    
    def _initialize_available_providers(self) -> None:
        """Initialize clients for all available providers."""
        for provider in ProviderConfig.get_available_providers():
            self.clients[provider] = ProviderClient(provider)
    
    def get_client(self, provider: BloomyProvider | str) -> ProviderClient:
        """Get a client for a specific provider.
        
        Args:
            provider: The provider to get a client for
            
        Returns:
            The provider client
            
        Raises:
            ValueError: If the provider is not available
        """
        if isinstance(provider, str):
            provider = BloomyProvider(provider.lower())
        
        if provider not in self.clients:
            raise ValueError(f"Provider {provider} is not available. Set the API key first.")
        
        return self.clients[provider]
    
    def get_best_provider_for_task(
        self,
        task_type: str,
        preferred_provider: BloomyProvider | str | None = None,
    ) -> ProviderClient:
        """Get the best provider for a given task.
        
        Args:
            task_type: The type of task (coding, general, etc.)
            preferred_provider: Optional preferred provider
            
        Returns:
            The best provider client for the task
        """
        if preferred_provider:
            return self.get_client(preferred_provider)
        
        # Smart routing based on task type
        if task_type in ["coding", "debugging", "code_review"]:
            # Prefer Anthropic or OpenAI for coding
            for provider in [BloomyProvider.ANTHROPIC, BloomyProvider.OPENAI]:
                if provider in self.clients:
                    return self.clients[provider]
        elif task_type in ["research", "complex"]:
            # Prefer models with strong reasoning
            for provider in [BloomyProvider.ANTHROPIC, BloomyProvider.GOOGLE]:
                if provider in self.clients:
                    return self.clients[provider]
        
        # Fall back to any available provider
        if self.clients:
            return next(iter(self.clients.values()))
        
        raise ValueError("No providers available. Set at least one API key.")
    
    def get_available_providers(self) -> list[BloomyProvider]:
        """Get list of available providers.
        
        Returns:
            List of available provider enums
        """
        return list(self.clients.keys())


def get_provider_router() -> MultiProviderRouter:
    """Get the global provider router instance.
    
    Returns:
        The multi-provider router
    """
    return MultiProviderRouter()


__all__ = [
    "BloomyProvider",
    "ProviderConfig",
    "ProviderClient",
    "MultiProviderRouter",
    "get_provider_router",
]
