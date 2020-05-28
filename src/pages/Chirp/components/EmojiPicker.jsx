import React from 'react'
import styled from 'styled-components'
import emojify  from 'emojify.js'
import 'emojify.js/dist/css/sprites/emojify.css'
emojify.setConfig({tag_type : 'span', mode: 'sprite' })

const Picker = styled.div`
  width: 286px;
  height: 300px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  overflow-y: scroll;
`

const emojiList = [ ':bowtie:',':smile:',':laughing:',':blush:',':smiley:',':relaxed:',':smirk:',':heart_eyes:',':kissing_heart:',':kissing_closed_eyes:',':flushed:',':relieved:',':satisfied:',':grin:',':wink:',':stuck_out_tongue_winking_eye:',':stuck_out_tongue_closed_eyes:',':grinning:',':kissing:',':kissing_smiling_eyes:',':stuck_out_tongue:',':sleeping:',':worried:',':frowning:',':anguished:',':open_mouth:',':grimacing:',':confused:',':hushed:',':expressionless:',':unamused:',':sweat_smile:',':sweat:',':disappointed_relieved:',':weary:',':pensive:',':disappointed:',':confounded:',':fearful:',':cold_sweat:',':persevere:',':cry:',':sob:',':joy:',':astonished:',':scream:',':neckbeard:',':tired_face:',':angry:',':rage:',':triumph:',':sleepy:',':yum:',':mask:',':sunglasses:',':dizzy_face:',':imp:',':smiling_imp:',':neutral_face:',':no_mouth:',':innocent:',':alien:',':yellow_heart:',':blue_heart:',':purple_heart:',':heart:',':green_heart:',':broken_heart:',':heartbeat:',':heartpulse:',':two_hearts:',':revolving_hearts:',':cupid:',':sparkling_heart:',':sparkles:',':star:',':star2:',':dizzy:',':boom:',':collision:',':anger:', ':point_up:',':point_down:',':point_left:',':point_right:',':raised_hands:',':pray:',':point_up_2:',':clap:',':muscle:',':metal:',':fu:',':runner:',':running:',':couple:',':family:',':two_men_holding_hands:',':two_women_holding_hands:',':dancer:',':dancers:',':ok_woman:',':no_good:',':information_desk_person:',':raising_hand:',':bride_with_veil:',':person_with_pouting_face:',':person_frowning:',':bow:',':couplekiss:',':couple_with_heart:',':massage:',':haircut:',':nail_care:',':boy:',':girl:',':woman:',':man:',':baby:',':older_woman:',':older_man:',':person_with_blond_hair:',':man_with_gua_pi_mao:',':man_with_turban:',':construction_worker:',':cop:',':angel:',':princess:',':smiley_cat:',':smile_cat:',':heart_eyes_cat:',':kissing_cat:',':smirk_cat:',':scream_cat:',':crying_cat_face:',':joy_cat:',':pouting_cat:',':japanese_ogre:',':japanese_goblin:',':see_no_evil:',':hear_no_evil:',':speak_no_evil:',':guardsman:',':skull:',':feet:',':lips:',':kiss:',':droplet:',':ear:',':eyes:',':nose:',':tongue:',':love_letter:',':bust_in_silhouette:',':busts_in_silhouette:',':speech_balloon:',':thought_balloon:' ]
export default function EmojiPicker(props){

  function selectEmoji(item){
    props.onSelect(item)
    // console.log(item)
  }
  // const [message, setMessage] = useState(0)

  return(
    <Picker>
      { emojiList.map(item => (
        <span
          key = { item }
          onClick={selectEmoji.bind(this,item)}
          dangerouslySetInnerHTML={ { __html: emojify.replace(item) } }>
        </span>
      )
      )
      }
    </Picker>
  )
}
