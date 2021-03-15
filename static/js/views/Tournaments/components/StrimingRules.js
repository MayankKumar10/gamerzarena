/* eslint-disable */

import React from "react";

import styles from "./JoinIndividual.module.scss";

const StrimingRules = (props) => {
    const description = `
  <h2 style="text-align: left;"><strong>Important</strong></h2><br>
<p style="text-align: center;">Do not stop your Live stream until you have finished playing or your entry will be void and no refunds will be issued.&nbsp;</p>
<p style="text-align: center;">You must finish your entry on the site within two minutes of the game you want to be scored, or it will result in a <em>Disqualification!</em></p>
<p style="text-align: center;">You will have&nbsp;<strong>
${props.tournamentDetail.contest.verbose_entry_time_limit}(${props.tournamentDetail.contest.entry_time_limit}) &nbsp;</strong>to complete your contest entry once you start streaming.</p>
<p style="text-align: center;">Start streaming on your <strong>STREAMING PLATFORM</strong> and click below when you're ready.</p>
<p style="text-align: center;">RESTREAMING IS 100% PROHIBITED! ALL ENTRIES MUST BE LIVE!</p>
<p style="text-align: center;"><br></p><span id="jodit-selection_marker_1607933414696_11334834868492627" data-jodit-selection_marker="end" style="line-height: 0; display: none;"></span>
  `
    return ( <
        div className = {
            styles.rulesWrapper
        } >
        <
        div dangerouslySetInnerHTML = {
            {
                __html: description,
            }
        }
        /> <
        /div>
    );
};

export default StrimingRules;