resource "azurerm_storage_account" "tf_seed" {
  name                            = "tfseed"
  resource_group_name             = azurerm_resource_group.kissa.name
  location                        = azurerm_resource_group.kissa.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false
}

resource "azurerm_storage_container" "tf_seed" {
  name                  = "tfseed"
  storage_account_name  = azurerm_storage_account.tf_seed.name
  container_access_type = "private"
}
