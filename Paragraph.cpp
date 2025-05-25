#include "Paragraph.h"


const std::set<size_t>& Paragraph::GetEntities() const {
	return mEntities; 
}

size_t Paragraph::GetCharsNum() const { 
	return mEntitiesNum;
}

Interval  Paragraph::GetPosition() const { 
	return mPosition;
}

//const std::string& Paragraph::GetText() const { 
//	return mText;
//}

void Paragraph::SetEntities(size_t entity) {
	mEntities.insert(entity);
	mEntitiesNum++; 
}
