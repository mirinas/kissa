resource "azurerm_log_analytics_workspace" "kissa_api" {
  name                = "kissa-api-log-analytics"
  location            = azurerm_resource_group.kissa.location
  resource_group_name = azurerm_resource_group.kissa.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "kissa_api" {
  name                       = "kissa-api-env"
  location                   = azurerm_resource_group.kissa.location
  resource_group_name        = azurerm_resource_group.kissa.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.kissa_api.id
}