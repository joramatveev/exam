backend:
  bash -c "cd ./backend && go build && ./backend"
frontend:
  bash -c "cd ./frontend && yarn install && yarn start"
.PHONY: backend frontend
