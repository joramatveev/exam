package main

import (
	"fmt"
	"time"
)

func (u *User) AddList(name string) *TodoList {
	id := int(time.Now().Unix())
	list := &TodoList{
		Id:        id,
		Name:      name,
		taskCount: 0,
		tasks:     make(map[int]*Task),
	}
	u.listCount++
	u.lists[list.Id] = list
	return list
}

func (u *User) RenameList(id int, name string) (*TodoList, error) {
	list, ok := u.lists[id]
	if !ok {
		return nil, fmt.Errorf("List with id %d not found", id)
	}
	list.Name = name
	return list, nil
}

func (u *User) GetList(id int) (*TodoList, error) {
	list, ok := u.lists[id]
	if !ok {
		return nil, fmt.Errorf("List with id %d not found", id)
	}
	return list, nil
}

func (u *User) GetLists() []*TodoList {
	lists := make([]*TodoList, 0, len(u.lists))
	for _, v := range u.lists {
		lists = append(lists, v)
	}
	return lists
}

func (u *User) DeleteList(id int) error {
	if _, ok := u.lists[id]; !ok {
		return fmt.Errorf("User with id %d not found", id)
	}
	delete(u.lists, id)
	return nil
}
