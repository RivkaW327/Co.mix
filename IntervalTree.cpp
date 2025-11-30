#include "IntervalTree.h"
#include <iostream>
#include <climits>
#include <memory>

Node::Node(size_t paragraphIndex, Interval i)
{
    this->paragraphIndex = paragraphIndex;
    this->i = i;
    this->max = i.high;
    this->left = nullptr;
    this->right = nullptr;
    this->height = 1; // Initialize to 1, not 0
}

Node::Node(Interval i) {
    this->paragraphIndex = 0; // Initialize paragraphIndex
    this->i = i;
    this->max = i.high;
    this->left = nullptr;
    this->right = nullptr;
    this->height = 1; // Initialize to 1, not 0
}

// A utility function to get the height of the tree 
int Node::Getheight() {
    if (this == nullptr)
        return 0;
    return this->height;
}

// Helper function to safely get height from shared_ptr
int getHeight(const std::shared_ptr<Node>& node) {
    return node ? node->Getheight() : 0;
}

// A utility function to right rotate subtree rooted with y 
std::shared_ptr<Node> Node::rightRotate(std::shared_ptr<Node> y) {
    if (!y || !y->left) return y;

    std::shared_ptr<Node> x = y->left;
    std::shared_ptr<Node> T2 = x->right;

    // Perform rotation
    x->right = y;
    y->left = T2;

    // Update heights and max values
    y->updateHeightAndMax();
    x->updateHeightAndMax();

    return x;
}

// A utility function to left rotate subtree rooted with x 
std::shared_ptr<Node> Node::leftRotate(std::shared_ptr<Node> x) {
    if (!x || !x->right) return x;

    std::shared_ptr<Node> y = x->right;
    std::shared_ptr<Node> T2 = y->left;

    // Perform rotation
    y->left = x;
    x->right = T2;

    // Update heights and max values
    x->updateHeightAndMax();
    y->updateHeightAndMax();

    return y;
}

// Get balance factor of node
int Node::getBalance() {
    if (this == nullptr) return 0;
    return getHeight(this->left) - getHeight(this->right);
}

void Node::updateHeightAndMax() {
    if (!this) return;

    // Update height
    this->height = 1 + std::max(getHeight(this->left), getHeight(this->right));

    // Update max value
    this->max = this->i.high;
    if (this->left && this->left->max > this->max) {
        this->max = this->left->max;
    }
    if (this->right && this->right->max > this->max) {
        this->max = this->right->max;
    }
}

std::shared_ptr<Node> Node::insertTree(std::shared_ptr<Node> root, std::shared_ptr<Node> n) {
    // Step 1: Perform normal BST insertion
    if (root == nullptr)
        return n;

    int n_low = n->i.low;

    if (n_low < root->i.low)
        root->left = insertTree(root->left, n);
    else if (n_low >= root->i.low) // Handle equal case
        root->right = insertTree(root->right, n);

    // Step 2: Update height and max of current node
    root->updateHeightAndMax();

    // Step 3: Get balance factor
    int balance = root->getBalance();

    // Step 4: Perform rotations if unbalanced
    // Left Left Case
    if (balance > 1 && root->left && n_low < root->left->i.low)
        return rightRotate(root);

    // Right Right Case
    if (balance < -1 && root->right && n_low >= root->right->i.low)
        return leftRotate(root);

    // Left Right Case
    if (balance > 1 && root->left && n_low >= root->left->i.low) {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }

    // Right Left Case
    if (balance < -1 && root->right && n_low < root->right->i.low) {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }

    return root;
}

bool Node::isOverlapping(Interval i1, Interval i2) {
    return i1.low <= i2.high && i2.low <= i1.high;
}

Node* Node::overlapSearch(Interval i) {
    if (this == nullptr) return nullptr;

    // Check if current interval overlaps with query interval
    if (isOverlapping(this->i, i))
        return this;

    // If left child exists and its max is >= query's low, search left
    if (this->left != nullptr && this->left->max >= i.low)
        return this->left->overlapSearch(i);

    // Otherwise search right
    if (this->right != nullptr)
        return this->right->overlapSearch(i);

    return nullptr;
}

void Node::inorder() {
    if (this == nullptr) return;

    if (this->left) this->left->inorder();
    std::cout << "[" << this->i.low << ", " << this->i.high << "]"
        << " max = " << this->max
        << " paragraph = " << this->paragraphIndex << std::endl;
    if (this->right) this->right->inorder();
}

int Node::GetParagraphIndex() {
    return this->paragraphIndex;
}

Node::~Node() = default;