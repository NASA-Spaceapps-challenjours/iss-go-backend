# 3D ISS Tracker
This is the backend of the project for NASA Spaceapps from the team Challenjours.

The backend is written in go and to get started building make sure you have go 1.19+.

Run the following and it will come up with a local server

```
go mod tidy
go run .
```

It will then be running at `http://localhost:8080/`

Projects used in this backend include
- [joshuaferrara/go-satellite](https://github.com/joshuaferrara/go-satellite)
- [gin-gonic/gin](https://github.com/gin-gonic/gin)
- [gin-gonic/gin-contrib](https://github.com/gin-gonic/contrib)
- [Cities Database](https://simplemaps.com/data/world-cities) - licensed granted through Creative Common
- and the standard go library

API Reference:

All of these are `GET` requests:
- `/getIssLocation` - gets the current Lattitude, Longitude, and altitude (km) of the ISS
- `/getPastFuturePresentIssLocation` - gets past, present, and future ISS locations up to 90 minutes

__TO BE IMPLEMENTED__:
- `/getClosestCities` - gets the closest cities