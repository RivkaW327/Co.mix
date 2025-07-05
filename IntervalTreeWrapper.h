#pragma once
#include <memory>
#include "IntervalTree.h"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;


class IntervalTreeWrapper {
public:
    IntervalTreeWrapper() : root(nullptr) {}
    void insert(const Interval& interval);
    void insert(size_t paragraphIndex, const Interval& interval);
    py::object overlapSearch(const Interval& interval);
    void inorder();
    bool isEmpty() const;

private:
    std::shared_ptr<Node> root;
};

