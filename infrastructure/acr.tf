# Azure container registry

resource "azurerm_container_registry" "kissa_acr" {
  name                = "kissacontainer"
  resource_group_name = azurerm_resource_group.kissa.name
  location            = azurerm_resource_group.kissa.location
  sku                 = "Basic"
  admin_enabled       = true
}