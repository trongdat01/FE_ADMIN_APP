import React from 'react'

type Props = {}

const Header = (props: Props) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-xl font-bold text-gray-800">Header</h1>
            </div>
        </header>
    )
}

export default Header