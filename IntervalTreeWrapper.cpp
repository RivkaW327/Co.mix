#include "IntervalTreeWrapper.h"




void IntervalTreeWrapper::insert(const Interval& interval) {
    auto node = std::make_shared<Node>(interval);
    root = Node::insertTree(root, node);
}

void IntervalTreeWrapper::insert(size_t paragraphIndex, const Interval& interval) {
    auto node = std::make_shared<Node>(paragraphIndex, interval);
    root = Node::insertTree(root, node);
}

py::object IntervalTreeWrapper::overlapSearch(const Interval& interval) {
    if (!root) {
        return py::none();
    }

    Node* result = root->overlapSearch(interval);
    if (result == nullptr) {
        return py::none();
    }

    py::dict result_dict;
    result_dict["interval"] = result->GetInterval();
    result_dict["paragraph_index"] = result->GetParagraphIndex();
    return result_dict;
}

void IntervalTreeWrapper::inorder() {
    if (root) {
        root->inorder();
    }
}

bool IntervalTreeWrapper::isEmpty() const {
    return this->root == nullptr;
}
