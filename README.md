# angularcore.net
Template for Angular front-end .net core back-end project template. 
This project template implement optimistic concurrency, generic entity management, unit test with code coverage.

## [DEMO](https://open-source.azurewebsites.net/)

## Prerequisite:
- Microsoft Visual Studio 2017 Community or Professional Edition (See: https://www.visualstudio.com/downloads/)
- .Net Core SDK (See: https://www.microsoft.com/net/download/core)
- .NET Core tools in Visual Studio 2017 (See: https://www.microsoft.com/net/download/core)
- OpenCover - Installed via Nuget (See: https://github.com/OpenCover/opencover/) PM> Install-Package OpenCover -Version 4.6.519
- ReportGenerator - Installed via Nuget (See: https://github.com/danielpalme/ReportGenerator) PM> Install-Package ReportGenerator -Version 2.5.8
- Node.js  (See: https://nodejs.org/en/)

## Note:
- Add DebugType: full into the PropertyGroup of the source test project.
  ```
  <PropertyGroup>
    <DebugType>full</DebugType>
  </PropertyGroup>
  ```

  The system has been updated to Angular v9