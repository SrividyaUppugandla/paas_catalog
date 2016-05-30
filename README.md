# PaaS Catalog service

## PaaS Catalog service will provide the list of services that are available in Cognizant One along with the platforms where they are deployed. It will also pull the list of services that are available in the target platform. The metadata of all the services and its supporting platforms will be stored in gist. The user will be able to see the list of services and search for a service.

#### Template application files

File | Description
:-- | :-- 
PaaSCatalog.js | This file expose all the rest api's. Configures the port and domain, starts the application on the available or given port.
package.json | All npm packages contain a file, this file holds various metadata relevant to the project.

### Application execution

- PaaSCatalog.js provides three routes

      Router | Description | Parameters
      :-- | :-- | :-- 
      /catalog | To get the entire data. | 1) type: this is to get the data of that particular type like category/hooks/services. 2) category: this is to get the particular category data (Note: used only for categories data. value of that parameter will be like 'Authentication/User Management').
      /searchcatalog | to get the data based on user search. | 1) searchString: user search string.2) type: type of data. Example category/hooks/services.
      /platformservices | to get the data once user has logged into particular platform to deploy. | 1) id: id of our onecognizant service. 2) platform: selected platforms list

- After all configuration is done, start the application and try 'YOUR_DOMAIN_URL' or 'YOUR_DOMAIN_URL'/catalog in the browser. For eg: http://localhost:3000/catalog or http://localhost:3000/
