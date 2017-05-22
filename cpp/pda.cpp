#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <string>
#include <utility>

std::vector<std::pair<std::pair<std::string, std::string>, int>> validTransitions = {
	{{"A1", "1B"}, -1}, // the number is the position of the start of the string
	{{"A_", "A_"}, 0},
	{{"A0", "$C"}, 0},
	{{"$B", "0A"}, -1},
	{{"B_", "_A"}, 0},
	{{"C0", "0C"}, 0},
	{{"C1", "1D"}, 0},
	{{"D1", "1D"}, 0},
	{{"_D", "E_"}, -1},
	{{"1E", "F_"}, -1},
	{{"1F", "F1"}, -1},
	{{"0F", "F0"}, -1},
	{{"F$", "$F"}, 0}
	};

int main()
{
	std::string s1, s2;
	std::cout << "Enter the first string: ";
	std::cin >> s1;
	std::vector<char> inChars(s1.begin(), s1.end());
	std::reverse(inChars.begin(), inChars.end());

	std::stack<char> s1Stack;
	for (char c : inChars)
	{
		// insert into stack
		s1Stack.push(c);
	}

	std::cout << "Enter the second string: ";
	std::cin >> s2;

	std::vector<char> s2Chars(s2.begin(), s2.end());
	for (int i = 0; i < s2Chars.size(); i++)
	{
		std::cout << "Read " << s1Stack.top() << " from stack and " << s2Chars[i] << " from array." << std::endl;
		if (s2Chars[i] == s1Stack.top())
		{
			s1Stack.pop();
		} else {
			// the character is not the same - We need to examine this one situation to see if it's valid
			for (auto t : validTransitions)
			{
				std::cout << "    Comparing s2's " << s2[i + t.second] << " == " << t.first.first[0] << std::endl;
				std::cout << "    Comparing s2's " << s2[i + 1 + t.second] << " == " << t.first.first[1] << std::endl;
				std::cout << "    Comparing s1's " << s1[i + t.second] << " == " << t.first.second[0] << std::endl;
				std::cout << "    Comparing s1's " << s1[i + 1 + t.second] << " == " << t.first.second[1] << std::endl;

				if (s1[i + t.second] == t.first.first[0] && s1[i + t.second + 1] == t.first.first[1] && s2[i + t.second] == t.first.second[0] && s2[i + 1 + t.second] == t.first.second[1])
				{
					std::cout << "Accepted" << std::endl;
					return 0;
				}
				std::cout << std::endl;
			}
			std::cout << "Rejected" << std::endl;
			return 0;
		}
	}
}

