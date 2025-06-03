 
#include "text_ranker.h"
#include "IntervalTree.h"

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "IntervalTreeWrapper.h"
//#include <pybind11/smart_ptr.h>


namespace py = pybind11;


PYBIND11_MODULE(textranker, m) {
    py::class_<TextRanker>(m, "TextRanker")
        .def(py::init<>())
        .def("ExtractKeyParagraphs", &TextRanker::ExtractKeyParagraphs,
            "A function that takes a chapter and entities and returns the K most important paragraphs in the chapter",
            py::arg("input"), py::arg("paragraphs"), py::arg("entities"), py::arg("topK"));

    py::class_<Interval>(m, "Interval")
        .def(py::init<>())
        .def(py::init<int, int>())
        .def_readwrite("low", &Interval::low)
        .def_readwrite("high", &Interval::high);

    // השתמש ב-wrapper במקום בצומת ישירות
    py::class_<IntervalTreeWrapper>(m, "IntervalTree")
        .def(py::init<>())
        .def("insert", py::overload_cast<const Interval&>(&IntervalTreeWrapper::insert),
            "Insert an interval into the tree")
        .def("insert", py::overload_cast<size_t, const Interval&>(&IntervalTreeWrapper::insert),
            "Insert an interval with paragraph index into the tree")
        .def("overlapSearch", &IntervalTreeWrapper::overlapSearch,
            "Search for overlapping intervals - returns dict with interval and paragraph_index or None")
        .def("inorder", &IntervalTreeWrapper::inorder, "Inorder traversal of the tree")
        .def("isEmpty", &IntervalTreeWrapper::isEmpty, "Check if tree is empty");
}