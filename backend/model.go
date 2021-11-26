package main

type UserStorage struct {
	users map[string]*User
}

type User struct {
	Email          string
	PasswordDigest string
	listCount      int
	lists          map[int]*TodoList
}

type TodoList struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	taskCount int
	tasks     map[int]*Task
}

type Task struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
}
