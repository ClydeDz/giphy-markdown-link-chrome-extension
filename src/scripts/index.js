var EXTENSION_NAME = 'giphy-markdown-link-extension'
var DATA_ATTRIBUTE_GIPHY_LINK = `data-${EXTENSION_NAME}-giphy-link`
var DATA_ATTRIBUTE_STYLE = `data-${EXTENSION_NAME}-style`
var EXTENSION_COPY_SYMBOL = 'M'
var COPY_LINK_BUTTON_CLASSNAME = `${EXTENSION_NAME}`
var SHOW_TOAST_CLASSNAME = `${EXTENSION_NAME}-toast-show`
var TOAST_TIMEOUT = 1500
var TOAST_MESSAGE = 'Markdown link for GIF copied'
var EXTENSION_LOOP_TIMEOUT = 2000

var GIPHY_CLASSNAME = 'giphy-gif'
var DATA_GIPHY_ID = 'data-giphy-id'
var TOAST_MESSAGE_CONTAINER = 'flash-message__MessageWrapper'
var TOAST_MESSAGE_TEXT = 'flash-message__Text'
var GIPHY_MARKDOWN_COPY_TEXT = giphyUniqueId => '![](https://media.giphy.com/media/'+ giphyUniqueId +'/giphy.gif)'

function insertCSS() {
    var doesExtensionStyleExist = document.head.getAttribute(DATA_ATTRIBUTE_STYLE)
    if(doesExtensionStyleExist) return;

    var extensionStyleTag = document.createElement("style")
    extensionStyleTag.setAttribute(DATA_ATTRIBUTE_STYLE, '')  
    extensionStyleTag.textContent = `
        .${COPY_LINK_BUTTON_CLASSNAME}:hover { background-color:white;color:black;border-radius:60px; }
        .${SHOW_TOAST_CLASSNAME} { max-height: 100px }
    `
    document.head.appendChild(extensionStyleTag)
}

function showToastMessage() {
    var toastMessageContainer = document.querySelectorAll(`[class^="${TOAST_MESSAGE_CONTAINER}"]`)[0]
    toastMessageContainer.classList.add(SHOW_TOAST_CLASSNAME)
    var toastMessageContent = document.querySelectorAll(`[class^="${TOAST_MESSAGE_TEXT}"]`)[0]
    toastMessageContent.innerHTML = TOAST_MESSAGE
}

function hideToastMessageAfterDelay() {
    setTimeout(function() {
        var toastMessageContainer = document.querySelectorAll(`[class^="${TOAST_MESSAGE_CONTAINER}"]`)[0]
        toastMessageContainer.classList.remove(SHOW_TOAST_CLASSNAME)
        var toastMessageContent = document.querySelectorAll(`[class^="${TOAST_MESSAGE_TEXT}"]`)[0]
        setTimeout(function() {
            toastMessageContent.innerHTML = ""
        }, TOAST_TIMEOUT/10)
    }, TOAST_TIMEOUT)
}

function insertExtensionCopyLinkButtons() {
    setTimeout(function () {        
        var allGifs = document.getElementsByClassName(GIPHY_CLASSNAME);
        
        for(var i=0; i <allGifs.length; i++) {
            var currentGif = allGifs[i]   
            var gifUniqueId = currentGif.getAttribute(DATA_GIPHY_ID)
            
            var extensionCopyLinkButton = document.createElement('a')            
            extensionCopyLinkButton.innerText = EXTENSION_COPY_SYMBOL
            extensionCopyLinkButton.setAttribute(DATA_ATTRIBUTE_GIPHY_LINK, gifUniqueId)
            extensionCopyLinkButton.className = COPY_LINK_BUTTON_CLASSNAME
            extensionCopyLinkButton.style = 'position:relative;top:30px;left:4px;z-index:99999;padding:2px 5px;font-weight:bold;'
            
            extensionCopyLinkButton.addEventListener('click', function(e) {
                var giphyLinkId = this.getAttribute(DATA_ATTRIBUTE_GIPHY_LINK)
                navigator.clipboard.writeText(GIPHY_MARKDOWN_COPY_TEXT(giphyLinkId))
                e.preventDefault()
                e.stopPropagation()
                showToastMessage()
                hideToastMessageAfterDelay()                
            })

            var extensionCopyLinkButtonsInserted = currentGif.querySelectorAll(`[class="${COPY_LINK_BUTTON_CLASSNAME}"]`)
            if(extensionCopyLinkButtonsInserted.length < 1) {
                currentGif.insertAdjacentElement("afterbegin", extensionCopyLinkButton);
            }            
        }    
        insertExtensionCopyLinkButtons()
    }, EXTENSION_LOOP_TIMEOUT)
}

insertCSS()
insertExtensionCopyLinkButtons()