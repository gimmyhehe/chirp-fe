import React, { useState } from 'react'

export default function ChirpInput(){

  const [message, setMessage] = useState(0)

  return(
    <MessegeBox>
      <Icon type="upload" style={{marginLeft:'8px'} } onClick={this.uploadFile}></Icon>
      <Dropdown overlay={<Picker onSelect={this.addEmoji} />} placement="topRight">
        <Icon type="smile" onClick={this.handleEmoji} ></Icon>
      </Dropdown>

      <Input
        ref={this.input}
        placeholder='Press Enter to send messege'
        value = { message }
        onKeyDown={this.handleSendMessage}
        onChange = {this.handleMessageChange}
      ></Input>
    </MessegeBox>
  )
}
