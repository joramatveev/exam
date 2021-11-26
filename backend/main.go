package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := initRoutes()
	r.Run(":8080")
}

func initRoutes() *gin.Engine {
	routes := gin.Default()

    /* ----------------------------------------------- */
    // PUBLIC ENDPOINTS
    /* ----------------------------------------------- */
	routes.Use(CORSMiddleware())
	routes.Use(TodoServiceMiddleware())
	routes.POST("/user/signup", UserSignUp)
	routes.POST("/user/signin", UserSignIn)

    /* ----------------------------------------------- */
    // PROTECTED ENDPOINTS
    /* ----------------------------------------------- */
	routes.GET("/user/me", AuthMiddleware(), GetUserInfo)

	routesLists := routes.Group("/todo", AuthMiddleware())
	routesLists.POST("/lists", CreateTodoList)
	routesLists.GET("/lists/:list_id", GetTodoList)
	routesLists.PUT("/lists/:list_id", RenameTodoList)
	routesLists.DELETE("/lists/:list_id", DeleteTodoList)
	routesLists.GET("/lists", GetTodoLists)

	routesTasks := routesLists.Group("/lists/:list_id/")
	routesTasks.POST("/tasks", CreateTodoTask)
	routesTasks.GET("/tasks/:task_id", GetTodoTask)
	routesTasks.PUT("/tasks/:task_id", UpdateTodoTask)
	routesTasks.DELETE("/tasks/:task_id", DeleteTodoTask)
	routesTasks.GET("/tasks", GetTodoTasks)

	return routes
}
