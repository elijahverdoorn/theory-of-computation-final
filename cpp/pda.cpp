#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <string>
#include <utility>

std::vector<std::pair<std::string, std::string>> validTransitions = {
		{"A1", "1B"},
		{"A_", "A_"},
		{"A0", "$B"},
		{"$B", "0A"},
		{"B_", "_A"},
		{"C0", "0C"},
		{"C1", "1C"},
		{"_1", "1_"},
		{"_D", "E_"},
		{"1E", "F_"},
		{"1F", "F1"},
		{"0F", "F0"},
		{"F$", "$F"}
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
		std::cout << c;
		// insert into stack
		s1Stack.push(c);
	}
	std::cout << std::endl;

	std::cout << "Enter the second string: ";
	std::cin >> s2;

	std::vector<char> s2Chars(s2.begin(), s2.end());
	for (int i = 0; i < s2Chars.size(); i++)
	{
		if (s2Chars[i] == s1Stack.top())
		{
			s1Stack.pop();
		} else {
			// the character is not the same - We need to examine this one situation to see if it's valid
			if (std::string(s2Chars[i] + s2Chars[i+1]) == std::string(s1stack)
			{

			}
		}
	}
}

