#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>

struct action
{
	int dir, move;
	char read, edit;
	action(char r, char e, int m, int d)
	{
		read = r;
		edit = e;
		move = m;
		dir = d;
	}
};

struct node
{
	std::vector<action> actions;
	bool accept = false; //default to false, we'll set the one to true that we need to be the accept state
};

bool turingMachine(std::vector<node> n, std::string s, int startState)
{
	int state = startState;      // holds the state
	int reading = 1;    // holds the character we are currently reading

	for (int actI = 0; actI < n[state].actions.size(); actI++)
	{
		if (n[state].actions[actI].read == s[reading])
		{
			// now reading the character
			std::cout << "Reading " << n[state].actions[actI].read << std::endl;

			// edit the character
			s[reading] = n[state].actions[actI].edit;
			// change the head

			reading += (int) n[state].actions[actI].dir;

			// move to the appropriate state
			state = n[state].actions[actI].move;

			// print relevant information
			std::cout << "  State  -> " << state << std::endl;
			std::cout << "  Head   -> " << s[reading] << std::endl;
			std::cout << "  String -> " << s << std::endl;

			// reset the state counter
			actI = -1;
		}
	}
	return n[state].accept;
}

int main()
{
	std::string fileName;
	std::cout << "Enter Turing Machine file name: ";
	std::cin >> fileName;
	std::cout << std::endl;
	std::ifstream infile(fileName);

	//number of nodes/states
	int size;
	infile >> size;
	std::vector<node> nodes(size);

	int startState, acceptState;
	infile >> startState;
	infile >> acceptState;

	nodes[acceptState].accept = true;

	int d, s, m;
	bool a;
	char r ,e, dir;

	/*
	* s = state index, r = char reading from tape string
	* e = what to edit current reading to
	* m = which state index to move to
	* d = direction to move head on tape string, -1 = left, 0 = stay, 1 = right
	*/

	while (infile >> s >> m >> r >> e >> dir)
	{
		if (dir == 'R')
		{
			d = 1;
		} else if (dir == 'L')
		{
			d = -1;
		} else if (dir == 'S')
		{
			d = 0;
		} else {
			std::cout << "Error. Direction Symbol not valid. Quitting." << std::endl;
			return -1;
		}
		nodes[s].actions.push_back(action(r, e, m, d));
	}

	infile.close();

	std::cout << "Read turing machine from file: " << fileName << std::endl;
	std::cout << "Enter string to test: ";
	std::string str;
	std::cin >> str;

	str = 'D' + str + 'D';
	std::cout << "Running TM on string " << str << std::endl;
	if(turingMachine(nodes, str, startState))
	{
		std::cout << "ACCEPT" << std::endl;
	} else {
		std::cout << "REJECT" << std::endl;
	}

	return 0;
}
