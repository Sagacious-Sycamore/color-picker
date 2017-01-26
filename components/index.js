import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import tinycolor from 'tinycolor2';
import ColorFamilyView from './ColorFamilyView.js';
import ColorFamilyInfoView from './ColorFamilyInfoView.js';
import CreateYourOwn from './CreateYourOwn.js';
import FilterBar from './FilterBar.js';
import {Button, Grid} from 'react-bootstrap';
import Templates from './Templates.js';
import MiniGame from './miniGame.js';
import MatchGame from './MatchGame.js';
import ColorNameMatchGame from './ColorNameMatchGame.js';

var sortObj = function (obj) {
  return Object.keys(obj).sort(function(a, b) {
    return obj[b] - obj[a];
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilter: 'mostClicked',
      currentFamily: {},
      colorFamilies: [],
      allFamilies: [],
      appClass: 'app-main-full',
      sidebarClass: 'app-sidebar-hidden',
      createClass: 'create-family-hidden',
      playGame: false,
      familyName: '',
      hiddenUnlocked: false,
      matchGame: false,
      palette: {
        color1: {name: 'Cyan', hex: '#2DE1FC', rgb: {a: 1, b: 252, g: 225, r: 45}},
        color2: {name: 'Spring Green', hex: '#2AFC98', rgb: {a: 1, b: 152, g: 252, r: 42}},
        color3: {name: 'Malachite', hex: '#09E85E', rgb: {a: 1, b: 94, g: 232, r: 9}},
        color4: {name: 'Mountain Meadow', hex: '#16C172', rgb: {a: 1, b: 114, g: 193, r: 22}},
        color5: {name: 'Blue Dianne', hex: '#214F4B', rgb: {a: 1, b: 75, g: 79, r: 33}},
      }
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.toggleSidebarOn = this.toggleSidebarOn.bind(this);
    this.toggleSidebarOff = this.toggleSidebarOff.bind(this);
    this.toggleSubmitForm = this.toggleSubmitForm.bind(this);
    this.fetchColors = this.fetchColors.bind(this);
    this.handlePaletteChange = this.handlePaletteChange.bind(this);
    this.handlePaletteEdit = this.handlePaletteEdit.bind(this);

  }

  hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    } : null;
  }

  //Filter display based on navbar color choices
  handleStateChange (color) {
    var filteredColorFamilies = [];

    this.setState({
      currentFilter: color,
    });

    var filteredColorFamilies = this.state.allFamilies.filter(function(colorFamily) {
      for(var i=1; i<=5; i++){
        var color = 'color' + i;
        var name = colorFamily[color].name.toLowerCase();
        if(name.indexOf(color) !== -1){
          return true;
        }
      }
    })

    this.state.allFamilies.forEach(function (obj) {
      var include = false;
      for (var key in obj) {
        if (key.slice(0,5) === 'color') {
          var colorRgb = this.hexToRGB(obj[key].hex, 16);
          if (color === 'red') {
            if (colorRgb.red > (1.7 * colorRgb.blue) && colorRgb.red > (1.7 * colorRgb.green))
              include = true;
          }
          if (color === 'blue') {
            if (colorRgb.blue > (1.7 * colorRgb.red) && colorRgb.blue > (1.7 * colorRgb.green))
              include = true;
          }
          if (color === 'green') {
            if (colorRgb.green > (1.7 * colorRgb.blue) && colorRgb.green > (1.7 * colorRgb.red))
              include = true;
          }
          if (color === 'all') {
            include = true;
          }
        }
      }
      if (include === true) {
        filteredColorFamilies.push(obj)
      }
    }.bind(this))
    this.setState({
      colorFamilies: filteredColorFamilies
    });
  }

  filterByCopyCount(filter){
    var filteredColorFamilies = [];

    this.setState({
      currentFilter: filter,
    });
  }

  setCurrentFamily(familyData) {
    this.setState({
      currentFamily: familyData
    });
  }

  unlock(){
    this.setState({
      hiddenUnlocked: true
    })
  }

  playMatchGame(){
    this.setState({
      matchGame: true
    })
  }


  toggleSubmitForm() {
    if (this.state.createClass === 'create-family-hidden') {
      this.setState({createClass: 'create-family-show'});
    } else {
      this.setState({
        createClass: 'create-family-hidden',
        familyName: '',
        palette: {
          color1: {name: 'Cyan', hex: '#2DE1FC', rgb: {a: 1, b: 252, g: 225, r: 45}},
          color2: {name: 'Spring Green', hex: '#2AFC98', rgb: {a: 1, b: 152, g: 252, r: 42}},
          color3: {name: 'Malachite', hex: '#09E85E', rgb: {a: 1, b: 94, g: 232, r: 9}},
          color4: {name: 'Mountain Meadow', hex: '#16C172', rgb: {a: 1, b: 114, g: 193, r: 22}},
          color5: {name: 'Blue Dianne', hex: '#214F4B', rgb: {a: 1, b: 75, g: 79, r: 33}},
        }
      });
    }
  }

  //Change state of components to display side via css

  toggleSidebarOn() {
    this.setState({
      sidebarClass: 'app-sidebar',
      appClass: 'app-main'
    });
    console.log('toggle on')
  }

  toggleSidebarOff() {
    this.setState({
      sidebarClass: 'app-sidebar-hidden',
      appClass: 'app-main-full'
    });
    console.log('toggle off')
  }

  fetchColors() {
    $.ajax({
      url: '/api/colors',
      success: function(data) {
        this.setState({ colorFamilies: data });
        this.setState({ allFamilies: data });
      }.bind(this),
      dataType: 'JSON'
    });
  }

  //load data before render
  componentWillMount() {
    this.fetchColors()
  }

  //Filters
  sortByToday() {
    var that = this
    $.ajax({
      method: 'GET',
      url: '/api/daily',
      success: function (resp) {
        var sortedFamilyId = sortObj(resp);

        that.setState({
          currentFilter: 'Today',
        });

        var all = that.state.allFamilies;

        var today = sortedFamilyId.map(function(id){
          for(var i=0; i<all.length; i++){
            if(all[i]._id === id) {
              return all[i];
            }
          }
        })

        that.setState({
          colorFamilies: today,
          popularToday: today
        });
      },
      error: function (error) {
        console.log('error', error);
      }
    })
  }

  sortByWeek(){
    var that = this
    $.ajax({
      method: 'GET',
      url: '/api/weekly',
      success: function (resp) {
        console.log(resp)

        var sortedFamilyId = sortObj(resp);

        that.setState({
          currentFilter: 'Weekly',
        });

        var all = that.state.allFamilies;

        var week = sortedFamilyId.map(function(id){
          for(var i=0; i<all.length; i++){
            if(all[i]._id === id) {
              return all[i];
            }
          }
        })

        week = week.filter(function(obj) {
          return obj === undefined ? false : true; 
        })

        that.setState({
          colorFamilies: week,
          popularWeek: week
        });
      },
      error: function (error) {
        console.log('error', error);
      }
    })
  }

  sortByMonth(){
    var that = this
    $.ajax({
      method: 'GET',
      url: '/api/monthly',
      success: function (resp) {

        var sortedFamilyId = sortObj(resp);
        sortedFamilyId = sortedFamilyId.filter(function(id) {
          return id === undefined ? false : true; 
        })

        that.setState({
          currentFilter: 'Monthly',
        });

        var all = that.state.allFamilies;

        var month = sortedFamilyId.map(function(id){
          for(var i=0; i<all.length; i++){
            if(all[i]._id === id) {
              return all[i];
            }
          }
        })

        month = month.filter(function(obj) {
          return obj === undefined ? false : true; 
        })

        that.setState({
          colorFamilies: month,
          popularMonth: month
        });
      },
      error: function (error) {
        console.log('error', error);
      }
    })
  }

  sortByCopyCount(){
    var that = this
    $.ajax({
      method: 'GET',
      url: '/api/copycount',
      success: function (resp) {
        var sortedFamilyId = sortObj(resp);

        that.setState({
          currentFilter: 'All-Time',
        });

        var all = that.state.allFamilies;

        var allTime = sortedFamilyId.map(function(id){
          for(var i=0; i<all.length; i++){
            if(all[i]._id === id) {
              return all[i];
            }
          }
        })

        allTime = allTime.filter(function(obj) {
          return obj === undefined ? false : true; 
        })

        that.setState({
          colorFamilies: allTime,
          popular: allTime
        });
      },
      error: function (error) {
        console.log('error', error);
      }
    })
  }

  playGame() {
    this.setState({
      playGame: !this.state.playGame
    })
  }

  handlePaletteChange(palette) {
    this.setState({
      palette: palette
    });
  }

  handleFormChange(key) {
    return function (e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }

  handlePaletteEdit(palette, name) {
    this.setState({
      palette: palette,
      familyName: name
    });
  }

  handleEnter(e){
    if (e.key === 'Enter') {
      var search = e.target.value.toLowerCase();
      var searchedHsl = tinycolor(search).toHsl().h;
      if(tinycolor(search).toHex() === '000000' && search.toLowerCase() !== 'black'){
        var filteredFamilies = this.state.allFamilies.filter(function(colorFamily) {
          if (colorFamily.name.toLowerCase().indexOf(search) !== -1){
            return true;
          }
          for(var i=1; i<=5; i++){
            var color = 'color' + i;
            var name = colorFamily[color].name.toLowerCase();
            if(name.indexOf(search) !== -1){
              return true;
            }
          }
          return false;
        })
      } else {
        var filteredFamilies = this.state.allFamilies.filter(function(colorFamily) {
          for(var i=1; i<=5; i++){
            var color = 'color' + i;
            var hex = colorFamily[color].hex;
            var h = tinycolor(hex).toHsl().h;
            var l = tinycolor(hex).toHsl().l;
            if(search.toLowerCase() === 'black'){
              if(l < 0.05) {
                return true;
              }
            } else if (search.toLowerCase() === 'white') {
              if(l > 0.95) {
                return true;
              }
            } else if (search.toLowerCase() === 'grey') {
              var s = tinycolor(hex).toHsl().s;
              if(s < 0.05){
                return true;
              }
            } else {
              if(h < searchedHsl + 25 && h > searchedHsl - 25 && l > 0.05 && l < 0.95) {
                return true;
              }
              //Special case for red
              if(searchedHsl < 25 || searchedHsl > 340) {
                if(h < 25 || h > 335) {
                  if(l > 0.05 && l < 0.95){return true};
                }
              }
            }
            
          }
          return false;
        })
      }
    }
    this.setState({
      currentFilter: search,
      colorFamilies: filteredFamilies
    });
  }

  render() {
    var that = this
    var whichgame = function(){
      if(that.state.matchGame) {
        return <MatchGame/>
      } else if (that.state.hiddenUnlocked) {
        return <MiniGame currentFamily={that.state.currentFamily} matchGame={that.playMatchGame.bind(that)}/>
      } else {
        return <ColorNameMatchGame unlock={that.unlock.bind(that)}/>
      }
    }

    var game = whichgame()

    if(this.state.playGame){
      return (
        <div className="app-body">
          <FilterBar className="app-nav" playGame={this.playGame.bind(this)} handleStateChange={this.handleStateChange} currentFilter={this.state.currentFilter} toggleSubmit={this.toggleSubmitForm} sortByToday={this.sortByToday.bind(this)} sortByWeek={this.sortByWeek.bind(this)} sortByMonth={this.sortByMonth.bind(this)} sortByCopyCount={this.sortByCopyCount.bind(this)}/>
          <br/>
          <br/>
          <br/>
          <div>{game}</div>
        </div>
      )
    } else {
      return (
        <div className="app-body">
          <FilterBar handleEnter={this.handleEnter.bind(this)} playingGame={this.state.playGame} playGame={this.playGame.bind(this)} className="app-nav" handleStateChange={this.handleStateChange} currentFilter={this.state.currentFilter} toggleSubmit={this.toggleSubmitForm} sortByToday={this.sortByToday.bind(this)} sortByWeek={this.sortByWeek.bind(this)} sortByMonth={this.sortByMonth.bind(this)} sortByCopyCount={this.sortByCopyCount.bind(this)}/>
          <div>
            <div className={this.state.appClass}>
              <div id="0" className={this.state.createClass}>
              <CreateYourOwn fetchColors={this.fetchColors.bind(this)} palette={this.state.palette} familyName={this.state.familyName} handlePaletteChange={this.handlePaletteChange.bind(this)} handleFormChange={this.handleFormChange.bind(this)}/>
              </div>
              <ColorFamilyView setCurrentFamily={this.setCurrentFamily.bind(this)} colorFamilies={this.state.colorFamilies} toggleSidebarOn={this.toggleSidebarOn}/>
            </div>
            <div className={this.state.sidebarClass}>
              <ColorFamilyInfoView currentFamily={this.state.currentFamily} toggleSubmitForm={this.toggleSubmitForm} toggleSidebarOff={this.toggleSidebarOff} fetchColors={this.fetchColors.bind(this)} handlePaletteEdit={this.handlePaletteEdit.bind(this)}/>
            </div>
          </div>
        </div>
      );
    }
  }
}

/*
<div className="app-body">
<FilterBar className="app-nav"  handleStateChange={this.handleStateChange} currentFilter={this.state.currentFilter} toggleSubmit={this.toggleSubmitForm} sortByToday={this.sortByToday.bind(this)} sortByWeek={this.sortByWeek.bind(this)} sortByMonth={this.sortByMonth.bind(this)} sortByCopyCount={this.sortByCopyCount.bind(this)}/>
  <div>
    <div className={this.state.createClass}>
    <CreateYourOwn fetchColors={this.fetchColors.bind(this)}/>
    </div>
    <div className={this.state.appClass}>
      <ColorFamilyView setCurrentFamily={this.setCurrentFamily.bind(this)} colorFamilies={this.state.colorFamilies} toggleSidebarOn={this.toggleSidebarOn}/>
    </div>
    <div className={this.state.sidebarClass}>
      <ColorFamilyInfoView currentFamily={this.state.currentFamily} toggleSidebarOff={this.toggleSidebarOff} fetchColors={this.fetchColors.bind(this)}/>
    </div>
*/


ReactDOM.render(
  <App />,
  document.getElementById('root')
);