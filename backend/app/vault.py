from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

class KeyVault:

    def __init__(self):
        self.vault_url = "https://kissa-vault.vault.azure.net"

    # Function to fetch secret from Azure Key Vault
    def get_secret(self, secret_name):
        credential = DefaultAzureCredential()
        secret_client = SecretClient(vault_url=self.vault_url, credential=credential)
    
        secret_bundle = secret_client.get_secret(secret_name)
        return secret_bundle.value