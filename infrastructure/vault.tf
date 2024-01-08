resource "azurerm_key_vault" "kissa_vault" {
  name                       = "kissa-vault"
  location                   = azurerm_resource_group.kissa.location
  resource_group_name        = azurerm_resource_group.kissa.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  soft_delete_retention_days = 7
}