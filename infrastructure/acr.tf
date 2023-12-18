# Azure container registry

resource "azurerm_container_registry" "kissa_acr" {
  name                = "kissacontainer"
  resource_group_name = azurerm_resource_group.kissa.name
  location            = azurerm_resource_group.kissa.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_container_registry_task" "kissa_task" {
  name                = "purgetask"
  container_registry_id = azurerm_container_registry.kissa_acr.id

  platform {
    os = "Linux"
  }

  encoded_step {
    task_content = <<EOF
    version: v1.1.0
    steps:
      - cmd: acr purge --filter 'REPO:kissa-api.*' --ago 1h
        disableWorkingDirectoryOverride: true
        timeout: 3600
    EOF
    context_path = "/dev/null"
  }

  timer_trigger {
    name     = "t1"
    schedule = "0 0 * * *" // Deletes every hour
    enabled  = true
  }
}

resource "azurerm_container_registry_task" "kissa_task_dev" {
  name                = "purgetask_dev"
  container_registry_id = azurerm_container_registry.kissa_acr.id

  platform {
    os = "Linux"
  }

  encoded_step {
    task_content = <<EOF
    version: v1.1.0
    steps:
      - cmd: acr purge --filter 'REPO:kissa-api-dev.*' --ago 1h
        disableWorkingDirectoryOverride: true
        timeout: 3600
    EOF
    context_path = "/dev/null"
  }

  timer_trigger {
    name     = "t1"
    schedule = "0 0 * * *" // Deletes every hour
    enabled  = true
  }
}