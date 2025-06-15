#pragma once
//#include <string>
#include <set>
#include "IntervalTree.h"
#include <string>


class Paragraph
{

public:
	// Constructor
	Paragraph() : mPosition({ 0, 0 }), mEntitiesNum(0) {}
	Paragraph(Interval position)
		: mPosition(position), mEntitiesNum(0) { }
	// Destructor
	~Paragraph() {}

	bool operator==(const Paragraph& other) const {
		return mPosition.high == other.mPosition.high && mPosition.low == other.mPosition.low && mEntitiesNum == other.mEntitiesNum && mEntities == other.mEntities;
	}

	// Getters
	Interval GetPosition() const;
	size_t GetCharsNum() const;
	const std::set<size_t>& GetEntities() const;

	//Setters
	//void SetCharsNum(size_t charsNum) { mCharsNum = charsNum; }
	void SetEntities(size_t entity);


private:
	Interval mPosition; // The position of the paragraph
	size_t mEntitiesNum;  // The number of entities in the paragraph
	std::set<size_t> mEntities;  // The entities in the paragraph


};

