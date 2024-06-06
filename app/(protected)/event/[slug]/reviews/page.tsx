import { Button } from '@/components/ui/button'
import React from 'react'

const Reviews = () => {
  return (
    <div>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Reviews</h4>
        <div>
          <Button variant="ghost" size="sm" className="p-4">
            <span className="mr-2 text-sm text-muted text-zinc-400">
              Add Reviews
            </span>
          </Button>
        </div>
      </div>

      

    </div>
  )
}

export default Reviews