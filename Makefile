backend:
	bash -c "cd ./backend && go build && ./backend"
  
frontend:
	bash -c "cd ./frontend && yarn install && yarn start"
	  
17frontend:
	bash -c "cd ./frontend && yarn install && yarn start17"
	
all: 
	bash -c "(cd ./backend && go build && ./backend) & cd ./frontend && yarn install && yarn start"	
	
17all: 
	bash -c "(cd ./backend && go build && ./backend) & cd ./frontend && yarn install && yarn start17"
