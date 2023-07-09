# build the react for production
FROM node:16.10.0-alpine as frontend

# working directory inside the container
WORKDIR /frontend

# copy package.json and lock file from host to image and install node modules
# this will speed up rebuilding image due to changes of source files as
# these layer are cached and do not have to be rebuilt
COPY ./diapertracker-frontend/package.json ./
COPY ./diapertracker-frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

#copy the rest of the source files into the container
COPY ./diapertracker-frontend .

# build the app ##
RUN yarn build


#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DiaperTracker.Backend/DiaperTracker.Api/DiaperTracker.Api.csproj", "DiaperTracker.Api/"]
RUN dotnet restore "DiaperTracker.Api/DiaperTracker.Api.csproj"
COPY ./DiaperTracker.Backend .
WORKDIR "/src/DiaperTracker.Api"
# Copy build js files for react app
COPY --from=frontend /frontend/build ./wwwroot

RUN dotnet build "DiaperTracker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DiaperTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DiaperTracker.Api.dll"]
