package main

import (
	"crypto/md5"
	"fmt"
)

type TodoService interface {
	AddUser(string, string) error
	GetUserInfo(string) (*User, error)
}

func NewTodoService() TodoService {
	return &UserStorage{
		users: make(map[string]*User),
	}
}

func (us *UserStorage) AddUser(email string, password string) error {
	if len(email) < 6 {
		return fmt.Errorf("Email length must be at least 6 symbols ")
	}

	if len(password) < 8 {
		return fmt.Errorf("Password length must be at least 8 symbols ")
	}

	if _, ok := us.users[email]; ok {
		return fmt.Errorf("User with email %s already exists", email)
	}

	us.users[email] = &User{
		Email:          email,
		PasswordDigest: string(md5.New().Sum([]byte(password))),
		listCount:      0,
		lists:          make(map[int]*TodoList),
	}

	return nil
}

func (us *UserStorage) GetUserInfo(email string) (*User, error) {
	u, ok := us.users[email]
	if !ok {
		return nil, fmt.Errorf("User with email %s not found", email)
	}

	return u, nil
}
