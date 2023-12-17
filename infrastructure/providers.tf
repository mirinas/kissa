terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0, < 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "kissa-rg"
    storage_account_name = "tfseed"
    container_name       = "tfseed"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}