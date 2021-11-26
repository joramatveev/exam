package main

import (
	"fmt"
	"time"
)

func (l *TodoList) AddTask(name string, description string) *Task {
	id := int(time.Now().Unix())
	task := &Task{
		Id:          id,
		Name:        name,
		Description: description,
		Status:      "open",
	}
	l.taskCount++
	l.tasks[task.Id] = task
	return task
}

func (l *TodoList) UpdateTask(id int, name string, description string, status string) (*Task, error) {
	task, ok := l.tasks[id]
	if !ok {
		return nil, fmt.Errorf("Task with id %d not found", id)
	}

	task.Name = name
	task.Description = description
	task.Status = status
	return task, nil
}

func (l *TodoList) GetTask(id int) (*Task, error) {
	task, ok := l.tasks[id]
	if !ok {
		return nil, fmt.Errorf("Task with id %d not found", id)
	}

	return task, nil
}

func (l *TodoList) GetTasks() []*Task {
	tasks := make([]*Task, 0, len(l.tasks))

	for _, v := range l.tasks {
		tasks = append(tasks, v)
	}

	return tasks
}

func (l *TodoList) DeleteTask(id int) error {
	if _, ok := l.tasks[id]; !ok {
		return fmt.Errorf("Task with id %d not found", id)
	}

	delete(l.tasks, id)
	return nil
}
