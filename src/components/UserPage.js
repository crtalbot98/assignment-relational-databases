import React from "react";
import {useSelector, useDispatch} from "react-redux";
import fire from "./Fire";
import firebase from "firebase";
import {userChange} from "../redux/actions";
import brokenImg from '../images/broken-img.png';
import {Link} from "react-router-dom";

function UserPage() {

    const [userItems, getItems] = React.useState([]);
    const getUserItems = useSelector(state => state.currentUser.userItems);
    const userId = useSelector(state => state.currentUser.id);
    const getUserChange = useSelector(state => state.userChange);
    const dispatch = useDispatch();
    const db = fire.firestore();

    React.useEffect(() => {

        getItems(getUserItems);
        console.log('removed');
    }, [db, getUserChange, getUserItems]);

    const removeFromUserItems = (item) => {
        db.collection('user').doc(userId).update({
            user_collection: firebase.firestore.FieldValue.arrayRemove(item)
        }).catch((err) => {
           alert(err);
        });
    };

    const userItemList = userItems.map((it, idx) =>
        <div key={idx} className={'item'}>
            <img src={it.image} onError={(e) => {
                e.target.onerror = null;
                e.target.src = brokenImg}
            } alt='' height={'100px'} width={'100px'}/>
            <div>
                <h2>{it.name}</h2>
                <p>{it.description}</p>
                <button onMouseUp={() => {removeFromUserItems({
                    id: it.id,
                    name: it.name,
                    description: it.description,
                    image: it.image
                });
                dispatch(userChange());
                }}>Remove item</button>
                <Link to={{pathname: `/item/${it.id}`}}>View Item</Link>
            </div>
        </div>
    );

    return(
        <div className={'item-container'}>
            {userItems.length < 1 ? 'Make sure to add an item to your list!' : userItemList}
        </div>
    )
}

export default UserPage;