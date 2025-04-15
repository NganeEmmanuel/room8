## 1. ✅ User Registration + Email/Phone Verification Flow

**Participants**:  
- User  
- Client App (Frontend)  
- Backend Server (API)  
- Email/SMS Service Provider  
- Database  

**Message Flow**:
1. User → Client App: Fill registration form  
2. Client App → Backend Server: POST /register  
3. Backend Server → Database: Store user data (unverified)  
4. Backend Server → Email/SMS Service: Send verification code  
5. Email/SMS Service → User: Deliver code  
6. User → Client App: Enter verification code  
7. Client App → Backend Server: POST /verify  
8. Backend Server → Database: Mark user as verified  
9. Backend Server → Client App: Registration successful  

---

## 2. ✅ Login + Token Validation Flow

**Participants**:  
- User  
- Client App  
- Backend Server  
- Database  
- Auth System  

**Message Flow**:
1. User → Client App: Enter login credentials  
2. Client App → Backend Server: POST /login  
3. Backend Server → Database: Validate credentials  
4. Backend Server → Auth System: Generate token  
5. Auth System → Backend Server: Return token  
6. Backend Server → Client App: Send token  
7. Client App → Backend Server: Access resource with token  
8. Backend Server → Auth System: Validate token  
9. Auth System → Backend Server: Confirm  
10. Backend Server → Client App: Grant access  

---

## 3. ✅ Become a Landlord (Authority Switch)

**Objects**:  
- User  
- System  
- Role Manager  
- Landlord Profile  

**Flow**:
1. User → System: Request role switch  
2. System → Role Manager: Verify eligibility  
3. Role Manager → System: Confirm switch  
4. System → Landlord Profile: Enable landlord role  
5. System → User: Confirmation  

---

## 4. ✅ Create/Edit/Delete Listing Flow

**Objects**:  
- Landlord  
- Listing Manager  
- Database  
- System  

**Flow (Create)**:
1. Landlord → Listing Manager: Enter listing data  
2. Listing Manager → System: Validate  
3. System → Database: Save listing  
4. System → Landlord: Confirmation  

*(Same logic for Edit/Delete with respective action.)*

---

## 5. ✅ Bid on Listing Flow

**Objects**:  
- Tenant  
- Listing  
- Bid Manager  
- Database  

**Flow**:
1. Tenant → Bid Manager: Submit bid  
2. Bid Manager → System: Validate  
3. System → Database: Store bid  
4. System → Tenant: Confirmation  

---

## 6. ✅ Accept/Reject Bid with Feedback Flow

**Objects**:  
- Landlord  
- Bid Manager  
- Tenant  
- Feedback System  

**Flow**:
1. Landlord → Bid Manager: acceptBid() / rejectBid()  
2. Bid Manager → Tenant: notify(status)  
3. Landlord → Feedback System: submitFeedback()  
4. Feedback System → Tenant: sendFeedback()  

---

## 7. ✅ Rate Listing Flow

**Objects**:  
- Tenant  
- Rating Module  
- Listing  

**Flow**:
1. Tenant → Rating Module: Submit rating  
2. Rating Module → Listing: Update rating  

---

## 8. ✅ Search with Filters Flow

**Objects**:  
- User  
- Filter Module  
- Search Engine  
- Listing Database  

**Flow**:
1. User → Filter Module: Apply filters  
2. Filter Module → Search Engine: Filter listings  
3. Search Engine → Listing Database: Fetch data  
4. Listing Database → Search Engine: Return results  
5. Search Engine → User: Show filtered results  

---

## 9. ✅ Share Profile with Landlord

**Objects**:  
- Tenant  
- Profile Manager  
- Landlord  

**Flow**:
1. Tenant → Profile Manager: shareProfile()  
2. Profile Manager → Landlord: sendProfile()  

---

## 10. ✅ Contact Bidder Flow

**Objects**:  
- Landlord  
- Bidder (Tenant)  
- Messaging System  

**Flow**:
1. Landlord → Messaging System: Send message  
2. Messaging System → Bidder: Deliver message  
3. Bidder → Messaging System: Reply  
4. Messaging System → Landlord: Deliver reply  
