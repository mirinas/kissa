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

resource "azurerm_container_app" "kissa_api" {
  name                         = "kissa-api"
  container_app_environment_id = azurerm_container_app_environment.kissa_api.id 
  resource_group_name          = azurerm_resource_group.kissa.name
  revision_mode                = "Single"

   secret {
    name  = "password"
    value = azurerm_container_registry.kissa_acr.admin_password
  }

  registry {
    server               = azurerm_container_registry.kissa_acr.login_server
    username             = azurerm_container_registry.kissa_acr.admin_username
    password_secret_name = "password"
  }

  ingress {
      external_enabled = true
      target_port = 8080
      traffic_weight {
        percentage = 100
      }
  }

  template {
    max_replicas = 1
    container {
      name   = "kissa-api"
      image  = "kissacontainer.azurecr.io/samples/kissa-api:0.0.1"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

}
