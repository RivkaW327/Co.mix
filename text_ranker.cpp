#include "text_ranker.h"
#include "IntervalTree.h"
#include <iostream>
#include <string>
#include <cmath>


// קמפול:
//  C:\Users\user\Documents\year2\project\TextRank\TextRank>C:\Users\user\AppData\Local\Programs\Python\Python312\python.exe setup.py build_ext --inplace

static std::vector<Paragraph> BuildParagraphs(const std::string& str, const std::vector<std::pair<int, int>> para) {
	std::vector<Paragraph> tokens;
	for (size_t i = 0; i < para.size(); i++) {
		Interval intr;
		intr.low = para[i].first;
		intr.high = para[i].second;
		tokens.push_back(Paragraph(intr));
	}
	return tokens;
}


static bool PairComp(std::pair<int, double> a, std::pair<int, double> b) 
{
    return a.second > b.second;
    //return a.second < b.second;
}

std::map<int, std::set<size_t>> TextRanker::ExtractKeyParagraphs(const std::string& input, std::vector< std::pair<int, int>> paragraphs, std::vector<std::vector<std::pair<int, int>>> entities, int topK)
{

    std::map<int, std::set<size_t>> outputs;

    //outputs.clear();
    if(input.empty() || topK < 1) {
        return outputs;
    }

    
    for (size_t i = 0; i < entities.size(); i++)
    {
        std::vector<Interval> entity;
        for (size_t j = 0; j < entities[i].size(); j++)
        {
            entity.push_back({ entities[i][j].first, entities[i][j].second });
        }
        this->mEntities.push_back(entity);
		//entity.clear();
    }

    // TextRank
    bool ret = true;
    ret &= ExtractParagraphs(input, paragraphs, this->mParagraphs);
    ret &= BuildGraph(this->mParagraphs, this->mEntities);
    ret &= CalcParagraphScores();

    if (!ret) {
        return outputs;
    }

    // Return the sentences with the highest score
    int kDim = mParagraphs.size();
    std::vector< std::pair<int, double> > visitPairs;  // (id, score)
    for(int i=0; i<kDim; ++i) {
        visitPairs.push_back(std::pair<int, double>(i, mScores[i]));
    }

	//quickSort(visitPairs, 0, visitPairs.size() - 1, PairComp); // Sort the pairs based on the score
    std::sort(visitPairs.begin(), visitPairs.end(), PairComp);


    for(int i=0; i<topK && i<kDim; ++i) {
        int id = visitPairs[i].first;
        outputs[id] = this->mParagraphs[id].GetEntities();
    }

    return outputs;
}


bool TextRanker::ExtractParagraphs(const std::string& input,std::vector<std::pair<int, int>> paragraphs, std::vector<Paragraph>& outputs)
{
    outputs.clear();
    if (input.empty()) { 
        //outputs.push_back({ "", 0, 0 });
        return false; 
    }

    static const int maxTextLen = 100000;  // Maximum number of entities (need to consider word separators, UTF encoding, etc.)
    std::string tempInput;
    if ((int)input.size() > maxTextLen) {
        tempInput = input.substr(0, maxTextLen);  // Articles that are too long will be truncated
    } else {
        tempInput = input;
    }


    // Paragraph segmentation
    static const int minParagraphLen = 40;   // Minimum number of entities in a sentence (need to consider word separators, UTF encoding, etc.)
    std::vector<Paragraph> tempOutput = BuildParagraphs(input, paragraphs); // split_with_positions(tempInput, "###PARA###");
    std::vector<Paragraph> tempOutput2;
    for (int i=0; i<(int)tempOutput.size(); i++) {
        if ((int)(tempOutput[i].GetPosition().high-tempOutput[i].GetPosition().low) < minParagraphLen) {
            tempOutput2.push_back(tempOutput[i]);   // The number of entities in a single sentence is too small, so it is discarded.
        }
        else {
            outputs.push_back(tempOutput[i]);
        }
    }

     //Deduplication
    //RemoveDuplicates(tempOutput2, outputs);

    // If there are too many sentences, they will be truncated
    static const int maxParagraphsNum = 30;
    if ((int)outputs.size() > maxParagraphsNum) {
        outputs.resize(maxParagraphsNum);
    }
    return true;
}


bool TextRanker::BuildGraph(std::vector<Paragraph>& paragraphs, const std::vector<std::vector<Interval>>& entities)
{
    if (paragraphs.empty()) { return false; }
    int kDim = paragraphs.size();

    // Calculate the adjacency matrix
    mAdjacencyMatrix.clear();
    mAdjacencyMatrix.resize(kDim, std::vector<double>(kDim, 0.0));

    InitCharsList(paragraphs, entities); // The words contained in each paragraph are made into a `set` in advance to speed up the calculation of GetSimilarity.

    for(int i = 0; i < kDim - 1; i++)
    {
        for(int j = i + 1; j < kDim; j++)
        {
            double similarity = GetSimilarity(i, j);
            // the similarity matrix is symmetrical, so transposes are filled in with the same similarity
            mAdjacencyMatrix[i][j] = similarity;
            mAdjacencyMatrix[j][i] = similarity;
        }
    }

    // Count the weight and number of outbound links of each node
    mOutWeightSum.clear();
    mOutWeightSum.resize(kDim, 0.0);

    for (int i=0; i<kDim; ++i) {
        for (int j=0; j<kDim; ++j) {
            if (i==j) { continue; }
            mOutWeightSum[i] += mAdjacencyMatrix[i][j];
        }
    }

    return true;
}

bool TextRanker::InitCharsList(std::vector<Paragraph>& paragraphs, const std::vector<std::vector<Interval>> entities)
{
    int kDim = paragraphs.size();
    if (paragraphs.empty()) {
        return false;
    }

    //std::vector<Interval> ints;

	// init the interval tree
    std::shared_ptr<Node> root = nullptr;
    for (size_t i = 0; i < (int)paragraphs.size(); i++)
    {
        //ints.push_back(paragraphs[i].GetPosition());
        root = Node::insertTree(std::move(root), std::make_shared<Node>(i, paragraphs[i].GetPosition()));
    }
    root->inorder();
	// check the intervals
    for (size_t i = 0; i < entities.size(); i++)
    {
        for (size_t j = 0; j < entities[i].size(); j++)
        {
            Node* res = root->overlapSearch(entities[i][j]);
            if (res == nullptr)
                std::cout << "\nNo overlaps ["<< entities[i][j].low<<" , "<< entities[i][j].high<<"]\n";
            else
                paragraphs[res->GetParagraphIndex()].SetEntities(i);

        }
    }
    return true;
}

float TextRanker::ParagraphScoreByPosition(int position, int totalParagraphs) const {
    float positionRatio;
    if (totalParagraphs > 1){
        positionRatio = position / (totalParagraphs - 1);
    }
    else {
        positionRatio = 0;
    }

    // בסיס U - curve עם התאמות
    float baseU = pow(2 * (positionRatio - 0.5), 2.0);
    float uWeight = 1.0 + baseU * 0.2;  // בונוס מתון יותר

    // תוספות קטנות לאזורים אסטרטגיים
    if (positionRatio <= 0.1) {  // 10 % הראשונים
        uWeight += 0.1;
    }
    else if(positionRatio >= 0.9) {  // 10 % האחרונים
        uWeight += 0.1;
    }
    else if(0.45 <= positionRatio <= 0.55) {  // בדיוק באמצע
        uWeight += 0.05;
    }

    return uWeight;
}


double TextRanker::GetSimilarity(int a, int b)
{
    // if a or b does not contains entities
    if (mParagraphs[a].GetCharsNum() == 0 || mParagraphs[b].GetCharsNum() == 0) {
        return 0.0;
    }

    std::vector<size_t> commonChars;
	std::set_intersection(
		mParagraphs[a].GetEntities().begin(),
		mParagraphs[a].GetEntities().end(),
		mParagraphs[b].GetEntities().begin(),
		mParagraphs[b].GetEntities().end(),
		std::back_inserter(commonChars)
	);
    
    double denominator = std::log(static_cast<double>(mParagraphs[a].GetCharsNum())) + std::log(static_cast<double>(mParagraphs[b].GetCharsNum()));
    if (std::fabs(denominator) < 1e-6) {
        return 0.0;
    }
    return 1.0 * commonChars.size() / denominator;
}

bool TextRanker::CalcParagraphScores()
{
    if (mAdjacencyMatrix.empty() || mAdjacencyMatrix[0].empty() || mOutWeightSum.empty()) {
        return false;
    }

    int kDim = mParagraphs.size();

    // Initially, the score of all nodes is 1.0
    mScores.clear();
    mScores.resize(kDim, 1.0);

    // iterate
    int iterNum=0;
    for (; iterNum<mMaxIter; iterNum++) {
        double maxDelta = 0.0;
        std::vector<double> newScores(kDim, 0.0); // current iteration score

        for (int i=0; i<kDim; i++) {
            double sum_weight = 0.0;
            for (int j=0; j<kDim; j++) {
                if (i == j || mOutWeightSum[j] < 1e-6)
                    continue;
                double weight = mAdjacencyMatrix[j][i];
                sum_weight += weight/mOutWeightSum[j] * mScores[j];
            }
            double newScore = 1.0-m_d + m_d*sum_weight;
            newScores[i] = newScore + this->ParagraphScoreByPosition(i, kDim);

            double delta = fabs(newScore - mScores[i]);
            maxDelta = std::max(maxDelta, delta);
        }

        mScores = newScores;
        if (maxDelta < mTol) {
            break;
        }
    }

    // std::cout << "iterNum: " << iterNum << "\n";
    return true;
}
