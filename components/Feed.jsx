"use client"

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}
const Feed = () => {
  const [allPosts, setAllPosts] = useState([])
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setAllPosts(data);
    }

    fetchPosts()
  }, [])

  console.log(allPosts);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i')

    return allPosts.filter((post) =>  
        regex.test(post.prompt) 
        || regex.test(post.tag) 
        || regex.test(post.creator.username)  
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)

    setSearchText(e.target.value)

    setSearchTimeout(() => {
      const searchResult = filterPrompts(e.target.value)
      setSearchedResults(searchResult)
    }, 500)
    
    setSearchedResults(searchedResults)
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompts(tagName)
    setSearchedResults(searchResult)
  }

  const handleClearSearchText = () => {
    setSearchText("")
  }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            required
            className="search_input peer"
          />
          <button
            type='button'
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={handleClearSearchText}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.53-9.47a.75.75 0 10-1.06-1.06L10 8.94 7.53 6.47a.75.75 0 00-1.06 1.06L8.94 10l-2.47 2.47a.75.75 0 101.06 1.06L10 11.06l2.47 2.47a.75.75 0 001.06-1.06L11.06 10l2.47-2.47z"
              clipRule="evenodd"
            />
          </svg>
          </button>
      </form>

      <PromptCardList
        data={searchText ? searchedResults: allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed