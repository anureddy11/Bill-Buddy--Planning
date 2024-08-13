import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import "./CreateExpensePage.css"

const CreateExpense = () => {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})
    const [total, setTotal] = useState(0)
    const [split, setSplit] = useState([])


    const [friend, setFriend] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [friendArr, setFriendArr] = useState([])
    const [evenVal, setEvenVal] = useState(0)
    const [isEven, setIsEven] = useState(false)
    const [amountElements, setAmountElements] = useState([])


    const extractNames = (arrayOfObjects) => {
        let namesArr = []

        arrayOfObjects.forEach(obj => {
            namesArr.push(obj.first_name + " " + obj.last_name)
        })
        return namesArr
    }

    const amountChange = (event) => {
        const query = event.target.value
        setTotal(parseInt(query))
        setIsEven(false)
    }

    const removeSplitFriends = (index) => {
        friendArr.splice(index, 1)
        amountElements.splice(index, 1)
        setFriendArr(friendArr)
        setIsEven(false)
    }

    const suggestionChange = (event) => {
        const query = event.target.value;
        setFriend(query);
        if (query) {
            const filteredFriends = friends.filter(friend =>
                friend["first_name"].toLowerCase().includes(query.toLowerCase())
            );
            let namesArr = extractNames(filteredFriends)
            setSuggestions(namesArr);
        } else {
            setSuggestions([]);
        }
    };

    const setEvenFunc = () => {
        let splitNum = total / friendArr.length
        setEvenVal(splitNum.toFixed(2))
        setIsEven(false)
        setIsEven(true)
        amountElements.forEach(el => {
            el.amount = evenVal
        })
    }

    // const handleOnClick = async (friend) => {
    //     const filteredFriends = friends.filter(f =>
    //         f["first_name"] === friend.split(' ')[0] && f["last_name"] === friend.split(' ')[1]
    //     )
    //     setFriendArr([...friendArr, friend])
    //     setIsEven(false)
    //     return
    // }

    const handleFriend = (friend) => {
        const friendObj = friends.filter(f =>
            f["first_name"].includes(friend.split(' ')[0]) && f["last_name"].includes(friend.split(' ')[1])
        )
        setFriendArr([...friendArr, ...friendObj])
        setAmountElements([...amountElements, {id: amountElements.length, amount: 0}])
        setFriend('');
        setSuggestions([]);
    };

    const handleAmountElements = (index) => {
        return amountElements[index].amount
    }


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [friendArr, isEven, evenVal, handleFriend]);

    const friends =  useSelector((state) => {
        return Object.values(state.friend.byId)
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {

        }
        let res = await dispatch(postGroup(payload))

        const imagePayload = {
            url: img,
            preview: true
        }
        navigate('/')
    }

    const handleClickOutside = (event) => {
        if (!event.target.closest('.autocomplete-container')) {
            setSuggestions([]);
        }
    };


    return (

        <form className="expense-form" onSubmit={handleSubmit}>
            <h2>Add an expense</h2>
            <div>
            <lable>Amount</lable>
            <input type="number" name="amount" value={total} onChange={amountChange}/>
            </div>
            <div>
            <lable>Description</lable>
            <input type="text"></input>
            </div>
            <div className="autocomplete-container">
            <input
                type="text"
                onChange={suggestionChange}
                value={friend}
                placeholder="Type a friend's name"
            />
            <button type="button" onClick={setEvenFunc}>Split evenly</button>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((friend, index) => (
                        <li
                            key={friend}
                            className={index === selectedIndex ? 'highlighted' : ''}
                            onClick={() => handleFriend(friend)}
                        >
                            {friend}
                        </li>
                    ))}
                </ul>
            )}

        </div>
        {friendArr.map((friend, index) => {
                return (
                    <>
                    <p>{friend.first_name + " " + friend.last_name}</p>
                    <label>Split amount</label>
                    <input type="text" value={isEven ? evenVal : handleAmountElements(index)} onChange={(e) => {
                        setIsEven(false)
                        amountElements[index].amount = e.target.value
                        }}/>
                    <button type="button" onClick={() =>removeSplitFriends(index)} onChange={() => setIsEven(false)}>remove</button>
                    </>
                )
            })}
            <div>
            <button>Submit</button>
            </div>
        </form>
    )
}


export default CreateExpense
