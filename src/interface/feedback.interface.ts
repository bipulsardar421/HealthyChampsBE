export type FeedbackInterface = {
    feedback_id: number,
    parent_id: number,
    // error_reported_id:number,
    error_reported: string,
    // suggestions_given_id:number,
    suggestions_given: string,
    
    };



    export type RequestFeedbackInterface = {
      parent_id: string,
      // error_reported_id:number,
      error_reported: string,
      // suggestions_given_id:number,
      suggestions_given: string,  
    };
      