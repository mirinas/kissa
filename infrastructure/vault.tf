resource "azurerm_key_vault" "kissa_vault" {
  name                       = "kissa-vault"
  location                   = azurerm_resource_group.kissa.location
  resource_group_name        = azurerm_resource_group.kissa.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "List",
      "Delete",
      "Get",
      "Purge",
      "Recover",
      "Update",
      "GetRotationPolicy",
      "SetRotationPolicy"
    ]

    secret_permissions = [
      "Get",
      "Set",
      "List",
      "Update"
    ]
  }
}

resource "azurerm_key_vault_secret" "secret" {
  name         = "SECRET-KEY-TOKEN"
  value        = "1cd38e0a7004b1694efbf1908bfc32ea0f858bb170e14b73ecc5fc1b412ecd20"
  key_vault_id = azurerm_key_vault.kissa_vault.id
}