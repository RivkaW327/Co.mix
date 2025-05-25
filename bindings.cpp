 
#include "text_ranker.h"
#include "IntervalTree.h"

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
//#include <pybind11/smart_ptr.h>


namespace py = pybind11;


PYBIND11_MODULE(textranker, m) {
    py::class_<TextRanker>(m, "TextRanker")
        .def(py::init<>())
        .def(py::init<double, int, double>())
        .def("ExtractKeyParagraphs", &TextRanker::ExtractKeyParagraphs,
            "A function that takes a chapter and entities and returns the K most important paragraphs in the chapter");
    //py::class_<Paragraph>(m, "Paragraph")
    //    .def(py::init<>())
    //    .def("GetText", &Paragraph::, "return the text of the paragraph");

    py::class_<Interval>(m, "Interval")
        .def(py::init<>())
        .def(py::init<int, int>())
        .def_readwrite("low", &Interval::low)
        .def_readwrite("high", &Interval::high);


	py::class_<Node>(m, "IntervalTree")
		.def(py::init<size_t, Interval>())
		.def_static("insert", &Node::insertTree, "Insert an interval into the tree")
		.def("overlapSearch", &Node::overlapSearch, "Search for overlapping intervals")
		.def("inorder", &Node::inorder, "Inorder traversal of the tree")
        .def_static("isOverlapping", &Node::isOverlapping, "Check if the interval is overlaping");
}
