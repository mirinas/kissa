data "azurerm_client_config" "current" {
}

resource "azurerm_resource_group" "kissa" {
  name     = "kissa-rg"
  location = "uksouth"
}
