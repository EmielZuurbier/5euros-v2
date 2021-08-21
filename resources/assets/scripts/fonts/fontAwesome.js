import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faGift,
  faSearch,
  faBeer,
  faSlidersH,
  faTimes,
  faDizzy,
  faLongArrowAltLeft
} from '@fortawesome/free-solid-svg-icons'

import { faPaypal } from '@fortawesome/free-brands-svg-icons'

export default function () {
  library.add(
    faCheck,
    faGift,
    faSearch,
    faBeer,
    faSlidersH,
    faTimes,
    faDizzy,
    faLongArrowAltLeft,
    faPaypal
  )
  dom.watch()
}
