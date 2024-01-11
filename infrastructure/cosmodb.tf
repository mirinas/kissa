resource "random_string" "kissa_db_account_name" {
  length  = 8
  upper   = false
  special = false
  numeric = false
}

resource "azurerm_cosmosdb_account" "kissa_db_account" {
  name                      = "kissa-db-${random_string.kissa_db_account_name.result}"
  location                  = azurerm_resource_group.kissa.location
  resource_group_name       = azurerm_resource_group.kissa.name
  offer_type                = "Standard"
  kind                      = "MongoDB"
  enable_automatic_failover = false
  geo_location {
    location          = azurerm_resource_group.kissa.location
    failover_priority = 0
  }
  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }
}

resource "azurerm_cosmosdb_mongo_database" "kissa_mongodb" {
  name                = "kissa-db"
  resource_group_name = azurerm_cosmosdb_account.kissa_db_account.resource_group_name
  account_name        = azurerm_cosmosdb_account.kissa_db_account.name
  throughput          = 400
}

resource "azurerm_cosmosdb_mongo_collection" "kissa_mongodb_match_collection" {
  name                = "kissa-db-match-collection"
  resource_group_name = azurerm_cosmosdb_account.kissa_db_account.resource_group_name
  account_name        = azurerm_cosmosdb_account.kissa_db_account.name
  database_name       = azurerm_cosmosdb_mongo_database.kissa_mongodb.name

  throughput          = 400

  index {
    keys   = ["_id"]
    unique = true
  }
}

resource "azurerm_cosmosdb_mongo_collection" "kissa_mongodb_profile_collection" {
  name                = "kissa-db-profile-collection"
  resource_group_name = azurerm_cosmosdb_account.kissa_db_account.resource_group_name
  account_name        = azurerm_cosmosdb_account.kissa_db_account.name
  database_name       = azurerm_cosmosdb_mongo_database.kissa_mongodb.name

  throughput          = 400

  index {
    keys   = ["_id"]
    unique = true
  }
}