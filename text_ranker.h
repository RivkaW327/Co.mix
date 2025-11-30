#pragma once
#include <string>
#include <vector>
#include <set>
#include "Paragraph.h"
#include "IntervalTree.h"
#include <unordered_set>
#include <algorithm>
#include <cmath>
#include <iterator>
#include <unordered_map>
#include <map>


class TextRanker {
public:
    explicit TextRanker()
        : m_d(0.85), mMaxIter(100), mTol(1.0e-5) { }
    explicit TextRanker(double d, int maxIter, double tol)
        : m_d(d), mMaxIter(maxIter), mTol(tol) { }

     ~TextRanker() { }

     std::map<int, std::set<size_t>> ExtractKeyParagraphs(const std::string& input, std::vector< std::pair<int, int>> paragraphs, std::vector<std::vector<std::pair<int, int>>> entities, int topK);

private:
    bool ExtractParagraphs(const std::string& input, std::vector<std::pair<int, int>> paragraphs, std::vector<Paragraph>& output);
    bool RemoveDuplicates(const std::vector<Paragraph>& input, std::vector<Paragraph>& output);
    bool BuildGraph(std::vector<Paragraph>& paragraphs, const std::vector<std::vector<Interval>>& entities);
    double GetSimilarity(int a, int b);
    bool CalcParagraphScores();
    bool InitCharsList(std::vector<Paragraph>& paragraphs, const std::vector<std::vector<Interval>> entities);
	float ParagraphScoreByPosition(int position, int totalParagraphs) const;

	std::string mInput;  // The input text
	std::vector<std::vector<Interval>> mEntities;  // The location of characters in the input text

    double m_d;  // The parameter d in the iteration formula
	int mMaxIter;   // Maximum number of iterations
    double mTol;   // Iteration accuracy
    std::vector<Paragraph> mParagraphs;  // Paragraphs after segmentation
    std::vector< std::vector<double>> mAdjacencyMatrix;  // Adjacency Matrix
    std::vector<double> mOutWeightSum;  // The weight of each node’s outbound link 
    std::vector<double> mScores;  // The score of each node
};
