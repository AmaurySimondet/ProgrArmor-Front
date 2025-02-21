import React from 'react';
import { InlineEditable } from '../../components/InlineEditable';
import { useWindowDimensions } from '../../utils/useEffect';
import { getDetailedDate } from '../../utils/dates';
import ProfilePic from '../../components/profilePic';

const FoodPostChild = ({
    user,
    postTitle,
    setPostTitle,
    postDescription,
    setPostDescription,
    selectedFoods,
    editable
}) => {
    const { width } = useWindowDimensions();
    console.log(user);
    const currentDate = new Date();

    return (
        <div>
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ProfilePic user={user} size="40px" onClick={() => {
                        window.location.href = `/compte?id=${user._id}`;
                    }} />
                    <div>
                        <strong><a href={`/compte?id=${user._id}`}>{user.fName} {user.lName}</a></strong>
                        <br />
                        <i style={{ fontSize: '12px' }}>Repas - {getDetailedDate(currentDate)}</i>
                    </div>
                </div>
            </div>

            {/* Post Title - Editable */}
            <InlineEditable
                value={postTitle}
                onChange={setPostTitle}
                style={{
                    fontSize: width < 500 ? '25px' : '30px',
                    marginBottom: "5px",
                    marginTop: "10px",
                    height: "40px"
                }}
                autoFocus={true}
                placeholder={"Titre du repas"}
            />

            {/* Post Description - Editable */}
            <InlineEditable
                value={postDescription}
                onChange={setPostDescription}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setPostDescription((prev) => prev + "\n");
                    }
                }}
                placeholder={"Description (optionnel)"}
                style={{
                    fontSize: '1rem',
                    marginBottom: "20px",
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    backgroundColor: "#f9f4f4",
                    height: "100px",
                    padding: "10px",
                    borderRadius: "5px"
                }}
            />

            {/* Food Details */}
            {selectedFoods && (
                <div style={{
                    backgroundColor: '#f9f4f4',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {selectedFoods.map((food, index) => (
                        <div key={index}>
                            <h3>{food.food_name}</h3>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                <div>
                                    <strong>Calories:</strong> {food.food_calories} kcal
                                </div>
                                <div>
                                    <strong>Protéines:</strong> {food.food_protein}g
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodPostChild; 