// ==UserScript==
// @name         Litepick Mines Game Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract cookies and local storage data for Litepick mines game
// @author       You
// @match        https://litepick.io/mine_game_page
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a small neon UI to print messages
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '10px';
    statusDiv.style.left = '10px';
    statusDiv.style.padding = '10px';
    statusDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    statusDiv.style.color = 'lime';
    statusDiv.style.fontFamily = 'Courier New, Courier, monospace';
    statusDiv.style.fontSize = '14px';
    statusDiv.style.border = '1px solid lime';
    statusDiv.style.borderRadius = '4px';
    statusDiv.style.zIndex = '10000';
    document.body.appendChild(statusDiv);

    function updateStatus(message) {
        statusDiv.innerHTML = message;
    }

    // Lightning-pipeline WebSocket connection
    var socket = new WebSocket('ws://localhost:3000/lightning-pipeline');

    socket.onopen = function() {
        updateStatus('⚡ Lightning Pipeline Connected');

        // Extract cookies
        var cookies = document.cookie.split(';').map(cookie => cookie.trim());
        console.log('Cookies:', cookies);

        // Extract local storage data
        var localStorageData = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            localStorageData[key] = localStorage.getItem(key);
        }
        console.log('Local Storage Data:', localStorageData);

        // Extract data for bet request
        var betData = {
            action: 'bet_game_mines',
            bet_amount: 0.000001,
            num_mines: 3,
            csrf_test_name: localStorageData.csrf_test_name
        };
        console.log('Bet Data:', betData);

        // Send data to backend
        var data = JSON.stringify({ cookies: cookies, localStorageData: localStorageData, betData: betData });
        socket.send(data);
        updateStatus('⚡ Data sent through Lightning Pipeline');
        console.log('⚡ Data sent through Lightning Pipeline');
    };

    socket.onmessage = function(event) {
        console.log('⚡ Pipeline Message:', event.data);
        updateStatus(`⚡ Pipeline Message: ${event.data}`);

        if (event.data === 'Data received') {
            console.log('✅ Backend Data Received');
            updateStatus('✅ Backend Data Received');
        } else if (event.data === 'Mines processed, check BOT') {
            console.log('💣 Mines Ready - Check Telegram!');
            updateStatus('💣 Mines Ready - Check Telegram!');
        }
    };

    socket.onclose = function() {
        console.log('⚡ Lightning Pipeline Closed');
        updateStatus('⚡ Lightning Pipeline Closed');
    };
})();
