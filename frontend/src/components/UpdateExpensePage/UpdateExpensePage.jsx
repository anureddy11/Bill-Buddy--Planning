import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateExpense, thunkGetExpenses } from "../../redux/expenses";

const UpdateExpense = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {expense_id} = useParams()
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

    const currentExpense = useSelector((state) => {
        if (state.expense.byId) {
            return state.expense.byId[expense_id]
        }
        return state.expense.byId
    })

    const setValues = () => {
        if (currentExpense) {
            setTotal(currentExpense.amount)
            setDescription(currentExpense.description)
            let arr1 = []
            let arr2 = []
            currentExpense.expenseShares.forEach((share, index) => {
                console.log(share)
                arr1.push({first_name: share.username, user_id: share.user_id})
                arr2.push({id: index, amount: parseFloat(share.amount)})

            })
            setFriendArr(arr1)
            setAmountElements(arr2)
        }
    }


    const handleDescription = (e) => {
        setDescription(e.target.value)
    }


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
            let smallNum = (bigNum / 100).toFixed(2)
            amountArr[amountArr.length-1].amount = parseFloat(smallNum)
        }
        setAmountElements(amountArr)
    }

    const handleFriend = (friend) => {
        const friendObj = friends.filter(f =>
            f["first_name"].includes(friend.split(' ')[0]) && f["last_name"].includes(friend.split(' ')[1])
        )
        friendObj[0].user_id = friendObj[0].id
        setFriendArr([...friendArr, ...friendObj])
        setAmountElements([...amountElements, {id: amountElements.length, amount: 0}])
        setFriend('');
        setSuggestions([]);
    };

    const handleAmountElements = (index) => {
        return amountElements[index].amount
    }


    useEffect(() => {
        if (!currentExpense) {
            dispatch(thunkGetExpenses());
        }

        if (currentExpense && on === "on") {
            setOn("off")
            setValues()
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };


    }, [dispatch, friendArr, isEven, evenVal, handleFriend, amountElements, setAmountElements]);

    const friends =  useSelector((state) => {
        return Object.values(state.friend.byId)
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const splitArr = []
        friendArr.forEach((friend, index) => {
            let splitObj = {}
            console.log(friend.user_id)
            splitObj.user_id = friend.user_id
            splitObj.amount = parseFloat(amountElements[index]['amount'])
            splitObj.settled = "no"
            splitArr.push(splitObj)
        })
        const payload = {
            amount: total,
            description: description,
            split: splitArr
        }

        await dispatch(thunkUpdateExpense(expense_id, payload))

        navigate('/all-expenses')
    }

    console.log(friendArr)

    const handleClickOutside = (event) => {
        if (!event.target.closest('.autocomplete-container')) {
            setSuggestions([]);
        }
    };


    return (

        <form className="expense-form" id="expense-form" onSubmit={handleSubmit}>
            <h2>Edit an expense</h2>
            <div>
            <lable>Amount</lable>
            <input type="number" name="amount" value={total} onChange={amountChange}/>
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
            />
            <button type="button" className="split-evenly-button" onClick={setEvenFunc}>Split evenly</button>
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

        </div>
        {friendArr.map((friend, index) => {
                return (
                    <>
                    <p>{friend.first_name}</p>
                    <label>Split amount</label>
                    <input type="text" value={handleAmountElements(index)} onChange={(e) => {
                        e.preventDefault()
                        amountElements[index].amount = e.target.value
                        setAmountElements([...amountElements])
                        setIsEven(false)

                        }}/>
                    <button type="button" onClick={() =>removeSplitFriends(index)} onChange={() => setIsEven(false)}>Remove</button>
                    </>
                )
            })}
            <div>
            <button className="submit-button">Update</button>
            </div>
        </form>
    )
}


export default UpdateExpense
