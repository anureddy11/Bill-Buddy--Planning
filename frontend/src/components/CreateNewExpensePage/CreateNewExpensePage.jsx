import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { thunkCreateExpense } from "../../redux/expenses";
import "./CreateNewExpensePage.css"

const CreateExpense = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [total, setTotal] = useState(0)
    const [description, setDescription] = useState('')
    const [on, setOn] = useState('on')
    const [friend, setFriend] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [friendArr, setFriendArr] = useState([])
    const [evenVal, setEvenVal] = useState(0)
    const [isEven, setIsEven] = useState(false)
    const [amountElements, setAmountElements] = useState([])


    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const currentUser = useSelector((state) => {
        if (state.session.user) {
            return state.session.user
        }
        return false
    })


    const extractNames = (arrayOfObjects) => {
        let namesArr = []

        arrayOfObjects.forEach(obj => {
            namesArr.push(obj.first_name + " " + obj.last_name)
        })
        return namesArr
    }

    const amountChange = (event) => {
        let query = event.target.value
        if (query.includes(".")) {
            let queryArr = query.split('.')
            if(queryArr[1].length > 2) {
                return
            }
        }

        setTotal(parseFloat(query))
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
        let difference = 0

        if (total - (parseFloat(splitNum.toFixed(2)) * friendArr.length !== 0)) {
            difference = (parseFloat((total - parseFloat(splitNum.toFixed(2) * friendArr.length)).toFixed(2)))
        }
        setEvenVal(splitNum.toFixed(2))
        setIsEven(true)
        let amountArr = []
        amountElements.forEach(el => {
            el.amount = splitNum.toFixed(2)
            amountArr.push(el)
        })

        if (difference < .03 && difference !== 0) {
            let bigNum = (parseFloat(amountArr[amountArr.length-1].amount) * 100) + (difference * 100)
            let smallNum = (bigNum / 100).toString()
            amountArr[amountArr.length-1].amount = smallNum
        }
        setAmountElements(amountArr)
    }

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

    const handleErrors = () => {
        let sum = 0

        amountElements.forEach(el => {
            sum += parseFloat(el.amount)
        })
        const errs = {}

        if (total !== sum) {
            errs.total = "All splits must add up to the exact amount."

        }

        if (errs.total) {
            setErrors(errs)
            return true
        }
        return false
    }


    useEffect(() => {
        if (currentUser && on === "on") {
            currentUser.first_name = currentUser.username
            currentUser.last_name = ""
            setFriendArr([currentUser])
            setAmountElements([{id: amountElements.length, amount: 0}])
            setOn("off")
        }



        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [friendArr, isEven, evenVal, handleFriend, amountElements, setAmountElements]);

    const friends =  useSelector((state) => {
        return Object.values(state.friend.byId)
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (handleErrors()) {
            return
        }
        const splitArr = []
        friendArr.forEach((friend, index) => {
            let splitObj = {}
            splitObj.user_id = friend.id
            splitObj.amount = parseFloat(amountElements[index]['amount'])
            friend.id === currentUser.id ? splitObj.settled = "yes" : splitObj.settled = "no"
            splitArr.push(splitObj)
        })
        const payload = {
            amount: total,
            description: description,
            split: splitArr
        }

        await dispatch(thunkCreateExpense(payload))

        navigate('/all-expenses')
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
            <input type="number" name="amount" step="0.01" value={total} onChange={amountChange}/>
            </div>
            <div>
            <lable>Description</lable>
            <input type="text" value={description} onChange={handleDescription}></input>
            </div>
            <div className="autocomplete-container">
            <input
                type="text"
                onChange={suggestionChange}
                value={friend}
                placeholder="Type a friend's name"
                id="input-suggestion"
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((friend, index) => (
                        <li
                            key={friend}
                            className={index === selectedIndex ? 'highlighted suggestion' : 'suggestion'}
                            onClick={() => handleFriend(friend)}
                        >
                            {friend}
                        </li>
                    ))}
                </ul>
            )}
            <button type="button" className="split-evenly-button" onClick={setEvenFunc}>Split evenly</button>


        </div>
        {friendArr.map((friend, index) => {
                return (
                    <>
                    <p>{friend.first_name + " " + friend.last_name}</p>
                    <label>Split amount</label>
                    <input type="text" value={handleAmountElements(index)} onChange={(e) => {
                        e.preventDefault()
                        amountElements[index].amount = e.target.value
                        setAmountElements([...amountElements])
                        setIsEven(false)

                        }}/>
                    <button type="button" onClick={() =>removeSplitFriends(index)} onChange={() => setIsEven(false)} id="New-remove-button">Remove</button>
                    </>
                )
            })}
            <div>
            <button className="submit-button">Submit</button>
            </div>
            <p id="errors">{errors.total}</p>
        </form>
    )
}


export default CreateExpense
