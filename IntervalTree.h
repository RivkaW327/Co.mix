#pragma once

#include <memory>

struct Interval {
	int low, high;
};

class Node

{
public:
	int Getheight();
	static std::shared_ptr<Node> rightRotate(std::shared_ptr<Node> y);
	static std::shared_ptr<Node> leftRotate(std::shared_ptr<Node> x);	int getBalance();
	void updateHeightAndMax();
	static std::shared_ptr<Node> insertTree(std::shared_ptr<Node> root, std::shared_ptr<Node> n);
	static bool isOverlapping(Interval i1, Interval i2);
	Node* overlapSearch(Interval i);
	void inorder();
	int GetParagraphIndex();
	Node(size_t paragraphIndex, Interval i);
	~Node();

private:
	size_t paragraphIndex;
	Interval i;
	int max;
	std::shared_ptr<Node> left, right;
	int height;
};
